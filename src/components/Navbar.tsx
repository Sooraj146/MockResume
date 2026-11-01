import React from 'react';
import { FileSearch, RefreshCw, FileText, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentName?: string;
  onReset: () => void;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  isAiMode?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentName,
  onReset,
  hasApiKey,
  onOpenApiKeyModal,
  isAiMode,
}) => {
  return (
    <header className="navbar">
      <div className="brand-logo">
        <div className="brand-icon">
          <FileSearch size={24} />
        </div>
        <div>
          <div className="brand-title">Resume AI Analyzer</div>
          <div className="brand-subtitle">ATS Insights & Interviewee Assistant</div>
        </div>
      </div>

      <div className="header-status">
        {/* Gemini AI Key Status Button */}
        <button
          className={`ai-status-btn ${hasApiKey ? 'connected' : ''}`}
          onClick={onOpenApiKeyModal}
          title={hasApiKey ? 'Gemini API Key Connected (Click to change)' : 'Connect Gemini API Key for deep analysis'}
        >
          <Sparkles size={14} className={hasApiKey ? 'text-cyan-400' : 'text-violet-400'} />
          <span>{hasApiKey ? (isAiMode ? 'Gemini AI Active' : 'Gemini AI Ready') : 'Connect Gemini AI'}</span>
          <span className="key-indicator">{hasApiKey ? 'KEY SET' : 'OPTIONAL'}</span>
        </button>

        {currentName ? (
          <div className="status-badge">
            <FileText size={14} className="text-violet-400" />
            <span>Analyzing: <strong>{currentName}</strong></span>
          </div>
        ) : (
          <div className="status-badge">
            <div className="status-dot" />
            <span>Ready for Analysis</span>
          </div>
        )}

        {currentName && (
          <button className="btn-secondary" onClick={onReset} title="Analyze another resume">
            <RefreshCw size={14} />
            <span>New Resume</span>
          </button>
        )}
      </div>
    </header>
  );
};
