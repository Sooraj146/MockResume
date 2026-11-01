import React from 'react';
import type { TechDetail } from '../data/techKnowledgeBase';
import {
  X,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  HelpCircle,
  Code2,
  Info
} from 'lucide-react';

interface TechStackInspectorProps {
  tech: TechDetail | null;
  onClose: () => void;
}

export const TechStackInspector: React.FC<TechStackInspectorProps> = ({ tech, onClose }) => {
  if (!tech) return null;

  return (
    <div className="tech-inspector-card fade-in">
      {/* Header */}
      <div className="tech-inspector-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
            <Code2 size={20} className="text-cyan-400" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{tech.name}</span>
              <span className="category-tag Tech-Stack" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                {tech.category}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Deep Technical Profile & Interview Knowledge
            </div>
          </div>
        </div>

        <button className="btn-icon" onClick={onClose} title="Close inspector">
          <X size={18} />
        </button>
      </div>

      {/* Content Body */}
      <div className="tech-inspector-body">
        {/* What is it */}
        <div className="inspector-section">
          <div className="inspector-title">
            <Info size={15} className="text-violet-400" />
            <span>What is it?</span>
          </div>
          <div className="inspector-content">
            {tech.whatIsIt}
          </div>
        </div>

        {/* Why is it used */}
        <div className="inspector-section">
          <div className="inspector-title">
            <Sparkles size={15} className="text-amber-400" />
            <span>Why is it used in Industry?</span>
          </div>
          <div className="inspector-content">
            {tech.whyUsed}
          </div>
        </div>

        {/* Core Advantages */}
        <div className="inspector-section">
          <div className="inspector-title">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>Key Advantages & Strengths:</span>
          </div>
          <ul className="inspector-advantages-list">
            {tech.advantages.map((adv, idx) => (
              <li key={idx} className="inspector-advantage-item">
                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" style={{ marginTop: '2px' }} />
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Important Details & Architecture Internals */}
        <div className="inspector-section">
          <div className="inspector-title">
            <Cpu size={15} className="text-cyan-400" />
            <span>Important Technical Concepts & Internals:</span>
          </div>
          <div className="inspector-internals-grid">
            {tech.importantDetails.map((detail, idx) => (
              <div key={idx} className="inspector-internal-card">
                <div className="internal-card-title">
                  <Layers size={14} className="text-cyan-400" />
                  <span>{detail.title}</span>
                </div>
                <div className="internal-card-desc">
                  {detail.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Interview Question Peek */}
        {tech.interviewQuestion && (
          <div className="inspector-section" style={{ background: 'rgba(139, 92, 246, 0.08)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(139, 92, 246, 0.25)' }}>
            <div className="inspector-title" style={{ color: 'var(--accent-violet)' }}>
              <HelpCircle size={15} className="text-violet-400" />
              <span>Common Technical Interview Question:</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px', marginBottom: '8px' }}>
              "{tech.interviewQuestion.question}"
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--accent-cyan)' }}>Key Talking Point: </strong>
              {tech.interviewQuestion.answerSummary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
