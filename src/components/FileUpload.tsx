import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  ShieldCheck,
  Zap,
  BrainCircuit,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  HelpCircle
} from 'lucide-react';

export interface ProgressState {
  percent: number;
  stageText: string;
  subText?: string;
}

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  progress?: ProgressState;
  errorMessage?: string | null;
  isGeminiEnabled: boolean;
  isGroqEnabled: boolean;
  onToggleGemini: (enabled: boolean) => void;
  onToggleGroq: (enabled: boolean) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  isLoading,
  progress,
  errorMessage,
  isGeminiEnabled,
  isGroqEnabled,
  onToggleGemini,
  onToggleGroq,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        onFileUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const anyAiActive = isGeminiEnabled || isGroqEnabled;
  const currentPercent = progress?.percent || 15;
  const currentStageText = progress?.stageText || 'Initializing Resume Analysis Pipeline...';

  // Determine active sub-step indicators
  const step1Done = currentPercent >= 35;
  const step2Done = currentPercent >= 65;
  const step3Done = currentPercent >= 85;
  const step4Done = currentPercent >= 98;

  return (
    <div className="upload-hero fade-in">
      <div className="upload-container-full">
        {/* Top Control Bar with Model Toggles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
              AI Engine Model Toggles:
            </span>
          </div>

          {/* Individual Toggle Switches */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Gemini Toggle */}
            <button
              type="button"
              onClick={() => onToggleGemini(!isGeminiEnabled)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: isGeminiEnabled ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${isGeminiEnabled ? 'rgba(6, 182, 212, 0.4)' : 'var(--border-subtle)'}`,
                color: isGeminiEnabled ? '#a5f3fc' : 'var(--text-dim)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'var(--transition-fast)',
              }}
            >
              <Sparkles size={14} className={isGeminiEnabled ? 'text-cyan-400' : 'text-muted'} />
              <span>Gemini (P1): <strong>{isGeminiEnabled ? 'ON' : 'OFF'}</strong></span>
              {isGeminiEnabled ? <ToggleRight size={18} className="text-cyan-400" /> : <ToggleLeft size={18} />}
            </button>

            {/* Groq Toggle */}
            <button
              type="button"
              onClick={() => onToggleGroq(!isGroqEnabled)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: isGroqEnabled ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${isGroqEnabled ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)'}`,
                color: isGroqEnabled ? '#fde68a' : 'var(--text-dim)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                transition: 'var(--transition-fast)',
              }}
            >
              <Zap size={14} className={isGroqEnabled ? 'text-amber-400' : 'text-muted'} />
              <span>Groq (P2): <strong>{isGroqEnabled ? 'ON' : 'OFF'}</strong></span>
              {isGroqEnabled ? <ToggleRight size={18} className="text-amber-400" /> : <ToggleLeft size={18} />}
            </button>
          </div>
        </div>

        {/* Dropzone with Multi-Stage Real-Time Progress Bar */}
        <div
          className={`dropzone full-width ${isDragOver ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            /* REAL-TIME PROGRESS BAR VIEW */
            <div className="progress-container-box fade-in" style={{ width: '100%', maxWidth: '680px', padding: '20px 0' }}>
              {/* Top Progress Percentage & Stage Label */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    Analysis Pipeline Active
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                    {currentStageText}
                  </div>
                </div>

                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {currentPercent}%
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="multi-stage-progress-track">
                <div
                  className="multi-stage-progress-fill"
                  style={{ width: `${currentPercent}%` }}
                />
              </div>

              {/* Step Checklist Indicators */}
              <div className="progress-steps-row">
                <div className={`progress-step-item ${step1Done ? 'done' : 'active'}`}>
                  <FileText size={15} />
                  <span>1. PDF Extraction</span>
                  {step1Done && <CheckCircle2 size={13} className="text-emerald-400" />}
                </div>

                <div className={`progress-step-item ${step2Done ? 'done' : step1Done ? 'active' : 'pending'}`}>
                  <Cpu size={15} />
                  <span>2. 600+ Skill Scan</span>
                  {step2Done && <CheckCircle2 size={13} className="text-emerald-400" />}
                </div>

                <div className={`progress-step-item ${step3Done ? 'done' : step2Done ? 'active' : 'pending'}`}>
                  <Layers size={15} />
                  <span>3. ATS Metrics</span>
                  {step3Done && <CheckCircle2 size={13} className="text-emerald-400" />}
                </div>

                <div className={`progress-step-item ${step4Done ? 'done' : step3Done ? 'active' : 'pending'}`}>
                  <HelpCircle size={15} />
                  <span>4. 30+ Q&A Generation</span>
                  {step4Done && <CheckCircle2 size={13} className="text-emerald-400" />}
                </div>
              </div>
            </div>
          ) : (
            /* DEFAULT UPLOAD VIEW */
            <>
              <div className="dropzone-icon" style={{ width: '68px', height: '68px' }}>
                <UploadCloud size={38} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <div className="dropzone-title" style={{ fontSize: '1.3rem' }}>
                  Upload Your Readable PDF Resume
                </div>
                <div className="dropzone-subtitle" style={{ fontSize: '0.9rem', marginTop: '6px', maxWidth: '560px' }}>
                  {anyAiActive
                    ? 'Deeply scans 600+ languages, frameworks & tools and generates 30+ custom resume-specific interview questions.'
                    : 'Instant ATS score, 600+ skill taxonomy parsing, and offline technical preparation (Cloud AI turned OFF).'}
                </div>
              </div>

              <label className="btn-upload" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                <FileText size={18} />
                <span>Browse & Upload PDF</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>

              {errorMessage && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#f87171',
                    fontSize: '0.88rem',
                    marginTop: '8px',
                    background: 'rgba(244, 63, 94, 0.1)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Feature Badges */}
              <div className="upload-features-bar">
                <div className="feature-pill">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>600+ Tech Skills Taxonomy</span>
                </div>
                <div className="feature-pill">
                  <BrainCircuit size={14} className="text-purple-400" />
                  <span>{anyAiActive ? '30+ Resume-Specific Questions' : 'Offline Local Mode'}</span>
                </div>
                <div className="feature-pill">
                  <Zap size={14} className="text-amber-400" />
                  <span>Interactive Tech Deep Inspector</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
