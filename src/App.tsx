import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FileUpload, type ProgressState } from './components/FileUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { QuestionsSection } from './components/QuestionsSection';
import { CommonQuestionsSection } from './components/CommonQuestionsSection';
import { ApiKeyModal } from './components/ApiKeyModal';
import {
  analyzeResumeText,
  calculateATSMetrics,
  matchesSkillSafe,
  ALIAS_NORMALIZATION_MAP,
  COMPREHENSIVE_SKILL_DICTIONARY
} from './services/resumeAnalyzer';
import {
  generateInterviewQuestionsWithCascade,
  type AIProvider,
  DEFAULT_GEMINI_API_KEY,
  DEFAULT_GROQ_API_KEY,
  DEFAULT_GEMINI_MODEL,
  DEFAULT_GROQ_MODEL,
} from './services/aiService';
import { parsePdfFile } from './services/pdfParser';
import type { ResumeAnalysisResult } from './types/resume';
import { LayoutDashboard, HelpCircle, AlertCircle, Terminal } from 'lucide-react';
import { COMMON_QUESTIONS_DATA } from './data/commonQuestions';

// Helper to determine skill category for verified skills
function getSkillCategory(skillName: string): string {
  const sLower = skillName.toLowerCase();
  for (const [catName, list] of Object.entries(COMPREHENSIVE_SKILL_DICTIONARY)) {
    if (list.some(item => item.toLowerCase() === sLower)) {
      return catName;
    }
  }
  return 'Other Technologies';
}

export function App() {
  const [provider, setProvider] = useState<AIProvider>(
    () => (localStorage.getItem('ai_provider') as AIProvider) || 'gemini'
  );
  const [geminiKey, setGeminiKey] = useState<string>(
    () => localStorage.getItem('gemini_api_key') || DEFAULT_GEMINI_API_KEY
  );
  const [groqKey, setGroqKey] = useState<string>(
    () => localStorage.getItem('groq_api_key') || DEFAULT_GROQ_API_KEY
  );
  const [selectedModel, setSelectedModel] = useState<string>(
    () => localStorage.getItem('ai_model') || DEFAULT_GEMINI_MODEL
  );

  // Individual toggles for Gemini and Groq
  const [isGeminiEnabled, setIsGeminiEnabled] = useState<boolean>(() => {
    return localStorage.getItem('gemini_model_enabled') !== 'false';
  });
  const [isGroqEnabled, setIsGroqEnabled] = useState<boolean>(() => {
    return localStorage.getItem('groq_model_enabled') !== 'false';
  });

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // Initial state is null (clean landing page)
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);

  const [activeTab, setActiveTab] = useState<'analysis' | 'resume-questions' | 'common-questions'>('common-questions');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<ProgressState>({
    percent: 0,
    stageText: 'Ready',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aiWarningMessage, setAiWarningMessage] = useState<string | null>(null);

  const handleToggleGemini = (enabled: boolean) => {
    setIsGeminiEnabled(enabled);
    localStorage.setItem('gemini_model_enabled', enabled ? 'true' : 'false');
  };

  const handleToggleGroq = (enabled: boolean) => {
    setIsGroqEnabled(enabled);
    localStorage.setItem('groq_model_enabled', enabled ? 'true' : 'false');
  };

  const handleSaveConfig = (newProvider: AIProvider, key: string, model: string) => {
    setProvider(newProvider);
    setSelectedModel(model);
    localStorage.setItem('ai_provider', newProvider);
    localStorage.setItem('ai_model', model);

    if (newProvider === 'gemini') {
      setGeminiKey(key);
      localStorage.setItem('gemini_api_key', key);
    } else if (newProvider === 'groq') {
      setGroqKey(key);
      localStorage.setItem('groq_api_key', key);
    }

    if (analysisResult && (isGeminiEnabled || isGroqEnabled)) {
      reAnalyzeWithAI(
        analysisResult.parsedResume,
        isGeminiEnabled,
        isGroqEnabled,
        newProvider === 'gemini' ? key : geminiKey,
        newProvider === 'groq' ? key : groqKey
      );
    }
  };

  const handleClearApiKey = () => {
    if (provider === 'gemini') {
      setGeminiKey('');
      localStorage.removeItem('gemini_api_key');
    } else if (provider === 'groq') {
      setGroqKey('');
      localStorage.removeItem('groq_api_key');
    }
  };

  const reAnalyzeWithAI = async (
    parsedResume: any,
    geminiOn: boolean = isGeminiEnabled,
    groqOn: boolean = isGroqEnabled,
    currentGeminiKey: string = geminiKey,
    currentGroqKey: string = groqKey
  ) => {
    setIsLoading(true);
    setAiWarningMessage(null);
    setAnalysisProgress({ percent: 70, stageText: 'Re-evaluating resume with AI engine...' });

    try {
      const { questions, usedModel, provider: computedProvider, aiExtractedSkills } = await generateInterviewQuestionsWithCascade(
        parsedResume,
        geminiOn,
        groqOn,
        currentGeminiKey,
        currentGroqKey,
        (pct, txt) => setAnalysisProgress({ percent: pct, stageText: txt })
      );

      // Only merge AI-detected skills if they are VERIFIED to exist in rawText
      if (aiExtractedSkills && aiExtractedSkills.length > 0) {
        for (const rawSkill of aiExtractedSkills) {
          const trimmedSkill = (rawSkill || '').trim();
          if (trimmedSkill && matchesSkillSafe(parsedResume.rawText, trimmedSkill)) {
            const canonical = ALIAS_NORMALIZATION_MAP[trimmedSkill.toLowerCase()] || trimmedSkill;
            if (!parsedResume.allSkills.some((s: string) => s.toLowerCase() === canonical.toLowerCase())) {
              parsedResume.allSkills.push(canonical);

              const catName = getSkillCategory(canonical);
              const existingCat = parsedResume.skillCategories.find((c: any) => c.category === catName);
              if (existingCat) {
                existingCat.skills.push(canonical);
              } else {
                parsedResume.skillCategories.push({ category: catName, skills: [canonical] });
              }
            }
          }
        }
      }

      setAnalysisResult(prev =>
        prev
          ? {
              ...prev,
              parsedResume,
              questions,
              isAiGenerated: computedProvider !== 'local',
              aiModelName: usedModel,
            }
          : null
      );
    } catch (err: any) {
      console.warn('AI generation failed, using local engine:', err);
      setAiWarningMessage(`AI Notice: ${err.message || 'Using local rule-based analysis.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);
    setAiWarningMessage(null);
    setAnalysisProgress({ percent: 10, stageText: 'Loading PDF file buffer...' });

    try {
      // Stage 1: Layout-Aware PDF Decoding with progress
      const { text, pageCount } = await parsePdfFile(file, (pct, txt) => {
        setAnalysisProgress({ percent: pct, stageText: txt });
      });

      // Stage 2: Deep Accurate Skill Scanning & Heuristic Section Parsing
      setAnalysisProgress({ percent: 52, stageText: 'Scanning Technologies & Building Skills Taxonomy...' });
      const parsedResume = analyzeResumeText(text, pageCount);
      if (parsedResume.contact.name === 'Candidate Name') {
        parsedResume.contact.name = file.name.replace(/\.pdf$/i, '');
      }

      // Stage 3: Calculate ATS Scoring & Section Health
      setAnalysisProgress({ percent: 68, stageText: 'Computing ATS Match Score & Section Health Density...' });
      let atsMetrics = calculateATSMetrics(parsedResume);

      let questions = [];
      let isAiGenerated = false;
      let usedModelName = 'Local Heuristics Engine (Offline Mode)';

      // Stage 4: 30+ Questions Generation with Gemini / Groq or Local
      if (isGeminiEnabled || isGroqEnabled) {
        setAnalysisProgress({ percent: 75, stageText: 'Connecting to AI Bar-Raiser Engine for Deep Grilling...' });
        const result = await generateInterviewQuestionsWithCascade(
          parsedResume,
          isGeminiEnabled,
          isGroqEnabled,
          geminiKey,
          groqKey,
          (pct, txt) => setAnalysisProgress({ percent: pct, stageText: txt })
        );

        questions = result.questions;
        isAiGenerated = result.provider !== 'local';
        usedModelName = result.usedModel;

        // Strictly verify and merge AI-detected skills against rawText
        if (result.aiExtractedSkills && result.aiExtractedSkills.length > 0) {
          let updatedSkills = false;
          for (const rawSkill of result.aiExtractedSkills) {
            const trimmedSkill = (rawSkill || '').trim();
            if (trimmedSkill && matchesSkillSafe(parsedResume.rawText, trimmedSkill)) {
              const canonical = ALIAS_NORMALIZATION_MAP[trimmedSkill.toLowerCase()] || trimmedSkill;
              if (!parsedResume.allSkills.some(s => s.toLowerCase() === canonical.toLowerCase())) {
                parsedResume.allSkills.push(canonical);

                const catName = getSkillCategory(canonical);
                const existingCat = parsedResume.skillCategories.find(c => c.category === catName);
                if (existingCat) {
                  existingCat.skills.push(canonical);
                } else {
                  parsedResume.skillCategories.push({ category: catName, skills: [canonical] });
                }
                updatedSkills = true;
              }
            }
          }
          if (updatedSkills) {
            atsMetrics = calculateATSMetrics(parsedResume);
          }
        }
      } else {
        setAnalysisProgress({ percent: 90, stageText: 'Synthesizing technical preparation model answers...' });
        const result = await generateInterviewQuestionsWithCascade(
          parsedResume,
          false,
          false
        );
        questions = result.questions;
        isAiGenerated = false;
        usedModelName = 'Local Heuristics Engine (AI Turned Off)';
      }

      setAnalysisProgress({ percent: 100, stageText: 'Analysis Complete! Launching Dashboard...' });

      setAnalysisResult({
        parsedResume,
        atsMetrics,
        questions,
        isAiGenerated,
        aiModelName: usedModelName,
      });

      setTimeout(() => {
        setActiveTab('analysis');
      }, 400);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to process PDF resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setErrorMessage(null);
    setAiWarningMessage(null);
    setActiveTab('common-questions');
  };

  const activeApiKey = provider === 'gemini' ? (geminiKey || DEFAULT_GEMINI_API_KEY) : (groqKey || DEFAULT_GROQ_API_KEY);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar
        currentName={analysisResult ? analysisResult.parsedResume.contact.name : undefined}
        onReset={handleReset}
        hasApiKey={Boolean(geminiKey.trim() || groqKey.trim())}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        isAiMode={analysisResult?.isAiGenerated}
      />

      {/* PDF Upload Hero with Real-Time Multi-Stage Progress Bar */}
      <FileUpload
        onFileUpload={handleFileUpload}
        isLoading={isLoading}
        progress={analysisProgress}
        errorMessage={errorMessage}
        isGeminiEnabled={isGeminiEnabled}
        isGroqEnabled={isGroqEnabled}
        onToggleGemini={handleToggleGemini}
        onToggleGroq={handleToggleGroq}
      />

      {/* Warning Notice if AI fell back */}
      {aiWarningMessage && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fde68a',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
          }}
        >
          <AlertCircle size={16} />
          <span>{aiWarningMessage}</span>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="tabs-header">
        {analysisResult && (
          <>
            <button
              className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              <LayoutDashboard size={18} />
              <span>ATS Analysis & Tech Stack</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'resume-questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('resume-questions')}
            >
              <HelpCircle size={18} />
              <span>Resume Q&A Guide</span>
              <span className="tab-badge">{analysisResult.questions.length}</span>
            </button>
          </>
        )}

        <button
          className={`tab-btn ${activeTab === 'common-questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('common-questions')}
        >
          <Terminal size={18} className="text-cyan-400" />
          <span>Common Technical Questions</span>
          <span className="tab-badge" style={{ background: 'var(--accent-cyan)' }}>
            {COMMON_QUESTIONS_DATA.length}
          </span>
        </button>
      </div>

      {/* Tab Views */}
      {activeTab === 'analysis' && analysisResult ? (
        <AnalysisDashboard
          parsed={analysisResult.parsedResume}
          metrics={analysisResult.atsMetrics}
        />
      ) : activeTab === 'resume-questions' && analysisResult ? (
        <QuestionsSection
          questions={analysisResult.questions}
          candidateName={analysisResult.parsedResume.contact.name}
          isAiGenerated={analysisResult.isAiGenerated}
          aiModelName={analysisResult.aiModelName}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />
      ) : (
        /* COMMON TECHNICAL QUESTIONS VIEW (Independent of Resume) */
        <CommonQuestionsSection />
      )}

      {/* Multi-Provider API Key & Engine Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={activeApiKey}
        provider={provider}
        selectedModel={selectedModel || (provider === 'gemini' ? DEFAULT_GEMINI_MODEL : DEFAULT_GROQ_MODEL)}
        isGeminiEnabled={isGeminiEnabled}
        isGroqEnabled={isGroqEnabled}
        onToggleGemini={handleToggleGemini}
        onToggleGroq={handleToggleGroq}
        onSaveConfig={handleSaveConfig}
        onClearKey={handleClearApiKey}
      />
    </div>
  );
}

export default App;
