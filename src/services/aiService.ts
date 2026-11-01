import type { InterviewQuestion, ParsedResume, QuestionCategory, QuestionDifficulty } from '../types/resume';
import { generateInterviewQuestions } from './questionGenerator';

export type AIProvider = 'gemini' | 'groq' | 'local';

export const DEFAULT_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const DEFAULT_GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

export const DEFAULT_GEMINI_MODEL = 'gemini-flash-latest';
export const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';

// Tier 1: Gemini Waterfall Models
const GEMINI_MODELS = ['gemini-flash-latest', 'gemini-3.7-flash', 'gemini-3-flash-preview'];

// Tier 2: Groq Waterfall Models
const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

const RESUME_SPECIFIC_SYSTEM_PROMPT = `You are an elite Principal Technical Interviewer, Engineering Hiring Manager, and ATS Bar-Raiser conducting a comprehensive, highly customized technical interview and skill extraction based on the candidate's uploaded resume.

CRITICAL INSTRUCTIONS:
1. ONLY identify technical skills, programming languages, frameworks, libraries, databases, and tools that are EXPLICITLY and LITERALLY written in the candidate resume text. DO NOT infer, assume, or hallucinate unmentioned technologies.
2. YOU MUST GENERATE AT LEAST 30 (30 to 35) RESUME-SPECIFIC INTERVIEW QUESTIONS directly interrogating the candidate's actual projects, stated tech stack, metrics, and architecture.
3. Every question MUST strictly use one of these 4 categories: ["Project Deep-Dive", "Tech Stack", "Behavioral", "Resume Deep-Dive"].

CATEGORY DISTRIBUTION TARGETS:
- "Project Deep-Dive" (8-10 questions): Dissecting projects, system architecture, data pipelines, scaling bottlenecks, single points of failure, concurrency, and numerical metrics.
- "Tech Stack" (10-12 questions): Deep questions on specific languages, frameworks, databases, applied data structures, operating systems, networking, and libraries listed on the resume.
- "Behavioral" (5-6 questions): STAR-method questions grounded in work history, managing tech debt, handling changing requirements, and production incidents.
- "Resume Deep-Dive" (4-5 questions): Career trajectory, design philosophy, technical choices, and milestones.

FOR EVERY QUESTION, YOU MUST PROVIDE:
- question: The exact, articulate interviewer question directly referencing the candidate's resume/skills/projects.
- answer: A comprehensive, high-depth model answer demonstrating how a top engineer would answer with clear structure, technical reasoning, and trade-offs.
- keyTalkingPoints: An array of 3 to 4 concise bullet points of must-mention concepts or buzzwords.
- category: Strictly one of ["Project Deep-Dive", "Tech Stack", "Behavioral", "Resume Deep-Dive"].
- difficulty: One of ["Easy", "Medium", "Hard"].
- contextTag: The specific project name, metric, or technology from their resume being grilled (e.g. "Project: E-Commerce API", "React & TypeScript Architecture", "PostgreSQL Index Optimization", "Latency Metric Reduction").

Return ONLY valid JSON with:
- "questions": Array of at least 30 question objects
- "customExtractedSkills": Array of string names of ONLY technical tools/languages EXPLICITLY present in the candidate resume text (do NOT include inferred skills)`;

// Test API Key connection
export async function testAIConnection(
  provider: AIProvider,
  apiKey: string,
  model: string
): Promise<{ success: boolean; message: string }> {
  try {
    if (provider === 'gemini') {
      const activeKey = (apiKey || DEFAULT_GEMINI_API_KEY).trim();
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Respond with "OK"' }] }] }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      return { success: true, message: `Connected successfully to Google Gemini (${model})!` };
    }

    if (provider === 'groq') {
      const activeKey = (apiKey || DEFAULT_GROQ_API_KEY).trim();
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeKey}`,
        },
        body: JSON.stringify({
          model: model || DEFAULT_GROQ_MODEL,
          messages: [{ role: 'user', content: 'Respond with "OK"' }],
          max_tokens: 10,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `HTTP ${res.status}: ${res.statusText}`);
      }
      return { success: true, message: `Connected successfully to Groq Cloud (${model})!` };
    }

    return { success: true, message: 'Local Heuristics Engine is always ready.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to connect to AI provider.' };
  }
}

// Multi-Tier Priority Waterfall with Individual API Toggles & Extra Skills Extraction:
export async function generateInterviewQuestionsWithCascade(
  parsed: ParsedResume,
  isGeminiEnabled: boolean = true,
  isGroqEnabled: boolean = true,
  geminiKey: string = DEFAULT_GEMINI_API_KEY,
  groqKey: string = DEFAULT_GROQ_API_KEY,
  onProgress?: (percent: number, stageText: string) => void
): Promise<{ questions: InterviewQuestion[]; usedModel: string; provider: AIProvider; aiExtractedSkills?: string[] }> {
  const activeGeminiKey = (geminiKey || DEFAULT_GEMINI_API_KEY).trim();
  const activeGroqKey = (groqKey || DEFAULT_GROQ_API_KEY).trim();

  const userPrompt = `Candidate Resume Profile:
Candidate Name: ${parsed.contact.name}
Target Title / Role: ${parsed.contact.title}
Detected Initial Skills: ${parsed.allSkills.join(', ')}

Candidate Summary / Bio:
${parsed.summary}

Candidate Work Experience Highlights:
${parsed.experiences.map((e, idx) => `Job ${idx + 1}: ${e.role} at ${e.company} (${e.period})\n- Highlights: ${e.highlights.join(' | ')}`).join('\n\n')}

Candidate Projects & Portfolio Details:
${parsed.projects.map((p, idx) => `Project ${idx + 1}: ${p.name}\n- Description: ${p.description}\n- Technologies: ${p.technologies.join(', ')}\n- Metrics/Impact: ${p.metrics || 'Not specified'}`).join('\n\n')}

Full Raw Resume Text:
${parsed.rawText}

INSTRUCTIONS:
Extract any additional technical tools/languages from the text, and generate AT LEAST 30 comprehensive questions with complete model answers, key talking points, difficulty, and context tags.
Every question MUST strictly use one of these 4 categories: "Project Deep-Dive", "Tech Stack", "Behavioral", or "Resume Deep-Dive".`;

  // ==========================================
  // TIER 1: GOOGLE GEMINI API (If Enabled)
  // ==========================================
  if (isGeminiEnabled && activeGeminiKey) {
    for (const model of GEMINI_MODELS) {
      try {
        if (onProgress) onProgress(78, `Connecting to Google Gemini (${model})...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeGeminiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: RESUME_SPECIFIC_SYSTEM_PROMPT }] },
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.65,
              maxOutputTokens: 8192,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const msg = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
          console.warn(`Gemini (${model}) error: ${msg}`);
          continue; // Failover
        }

        if (onProgress) onProgress(90, 'Decoding and structuring 30+ interview questions...');
        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawContent) continue;

        const parsedJson = JSON.parse(rawContent);
        const questionsArray = Array.isArray(parsedJson.questions)
          ? parsedJson.questions
          : Array.isArray(parsedJson)
          ? parsedJson
          : [];

        const aiSkills: string[] = Array.isArray(parsedJson.customExtractedSkills)
          ? parsedJson.customExtractedSkills
          : [];

        if (questionsArray.length >= 15) {
          if (onProgress) onProgress(98, 'Finalizing technical breakdown & model answers...');
          return {
            questions: formatRawQuestionsTo4Categories(questionsArray),
            usedModel: `Gemini (${model})`,
            provider: 'gemini',
            aiExtractedSkills: aiSkills,
          };
        }
      } catch (err: any) {
        console.warn(`Gemini (${model}) exception:`, err.message);
      }
    }
  }

  // ==========================================
  // TIER 2: GROQ CLOUD API (If Enabled)
  // ==========================================
  if (isGroqEnabled && activeGroqKey) {
    for (const model of GROQ_MODELS) {
      try {
        if (onProgress) onProgress(80, `Querying Groq Cloud (${model}) for rapid inference...`);
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeGroqKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: RESUME_SPECIFIC_SYSTEM_PROMPT },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.6,
            max_tokens: 8000,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.warn(`Groq (${model}) error:`, errorData?.error?.message || response.statusText);
          continue; // Failover
        }

        if (onProgress) onProgress(92, 'Formatting Groq high-speed response & model answers...');
        const data = await response.json();
        const rawContent = data.choices?.[0]?.message?.content;
        if (!rawContent) continue;

        const parsedJson = JSON.parse(rawContent);
        const questionsArray = Array.isArray(parsedJson.questions)
          ? parsedJson.questions
          : Array.isArray(parsedJson)
          ? parsedJson
          : [];

        const aiSkills: string[] = Array.isArray(parsedJson.customExtractedSkills)
          ? parsedJson.customExtractedSkills
          : [];

        if (questionsArray.length >= 15) {
          if (onProgress) onProgress(98, 'Finalizing technical breakdown & model answers...');
          return {
            questions: formatRawQuestionsTo4Categories(questionsArray),
            usedModel: `Groq (${model})`,
            provider: 'groq',
            aiExtractedSkills: aiSkills,
          };
        }
      } catch (err: any) {
        console.warn(`Groq (${model}) exception:`, err.message);
      }
    }
  }

  // ==========================================
  // TIER 3: LOCAL HEURISTICS MODEL
  // ==========================================
  if (onProgress) onProgress(95, 'Running Local Offline Heuristics Engine (30+ Questions)...');
  const localQuestions = generateInterviewQuestions(parsed);

  return {
    questions: formatRawQuestionsTo4Categories(localQuestions),
    usedModel: !isGeminiEnabled && !isGroqEnabled
      ? 'Local Heuristics Engine (AI Turned Off)'
      : 'Local Heuristics Engine (Offline Fallback)',
    provider: 'local',
  };
}

// Maps any question into strictly one of the 4 allowed categories
function formatRawQuestionsTo4Categories(rawList: any[]): InterviewQuestion[] {
  const allowedCategories: QuestionCategory[] = [
    'Project Deep-Dive',
    'Tech Stack',
    'Behavioral',
    'Resume Deep-Dive',
  ];

  return rawList.map((q: any, idx: number) => {
    let category: QuestionCategory = 'Tech Stack';
    const catLower = (q.category || '').toLowerCase();

    if (allowedCategories.includes(q.category)) {
      category = q.category;
    } else if (catLower.includes('project') || catLower.includes('architecture') || catLower.includes('system design')) {
      category = 'Project Deep-Dive';
    } else if (catLower.includes('behavior') || catLower.includes('leadership') || catLower.includes('star')) {
      category = 'Behavioral';
    } else if (catLower.includes('resume') || catLower.includes('career') || catLower.includes('background') || catLower.includes('experience')) {
      category = 'Resume Deep-Dive';
    } else {
      category = 'Tech Stack';
    }

    const validDifficulties: QuestionDifficulty[] = ['Easy', 'Medium', 'Hard'];
    const difficulty: QuestionDifficulty = validDifficulties.includes(q.difficulty) ? q.difficulty : 'Medium';

    return {
      id: `ai-q-${idx + 1}`,
      question: q.question,
      answer: q.answer || 'Ideal model answer for technical interview preparation.',
      keyTalkingPoints: Array.isArray(q.keyTalkingPoints) ? q.keyTalkingPoints : [],
      category,
      difficulty,
      contextTag: q.contextTag || category,
    };
  });
}
