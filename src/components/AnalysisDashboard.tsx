import React, { useState } from 'react';
import type { ATSMetrics, ParsedResume } from '../types/resume';
import { ScoreGauge } from './ScoreGauge';
import { TechStackInspector } from './TechStackInspector';
import { getTechDetail, type TechDetail } from '../data/techKnowledgeBase';
import {
  CheckCircle,
  AlertTriangle,
  Code2,
  Sparkles,
  Target,
  MousePointerClick
} from 'lucide-react';

interface AnalysisDashboardProps {
  parsed: ParsedResume;
  metrics: ATSMetrics;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ parsed, metrics }) => {
  // Automatically select the first skill or null
  const [selectedTech, setSelectedTech] = useState<TechDetail | null>(() => {
    if (parsed.allSkills.length > 0) {
      return getTechDetail(parsed.allSkills[0]);
    }
    return null;
  });

  const handleSkillClick = (skillName: string) => {
    const detail = getTechDetail(skillName);
    setSelectedTech(detail);
  };

  return (
    <div className="dashboard-grid fade-in">
      {/* Sidebar: Overall ATS & Health Score */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-card">
          <div className="card-title">
            <Target className="text-violet-400" size={20} />
            <span>Technical ATS Match Score</span>
          </div>

          <ScoreGauge score={metrics.overallScore} />

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <StatMeter label="Skill Keyword Density" value={metrics.skillDensityScore} color="var(--accent-violet)" />
            <StatMeter label="Impact & Metrics Density" value={metrics.impactMetricScore} color="var(--accent-cyan)" />
            <StatMeter label="Formatting & Structure" value={metrics.formattingScore} color="var(--accent-emerald)" />
            <StatMeter label="Readability Index" value={metrics.readabilityScore} color="var(--accent-amber)" />
          </div>
        </div>
      </div>

      {/* Main Analysis Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Resume Health Insights */}
        <div className="glass-card">
          <div className="card-title">
            <Sparkles className="text-amber-400" size={20} />
            <span>Resume Technical Insights</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Strengths */}
            <div>
              <div className="cat-heading" style={{ color: '#34d399', marginBottom: '10px' }}>Key Technical Strengths</div>
              <div className="insight-list">
                {metrics.strengths.map((str, idx) => (
                  <div key={idx} className="insight-item strength">
                    <CheckCircle className="insight-icon" size={16} />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div>
              <div className="cat-heading" style={{ color: '#fbbf24', marginBottom: '10px' }}>Recommended Improvements</div>
              <div className="insight-list">
                {metrics.improvements.map((imp, idx) => (
                  <div key={idx} className="insight-item improvement">
                    <AlertTriangle className="insight-icon" size={16} />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Tech Stack & Skills Taxonomy with Interactive Side Inspector */}
        <div className="glass-card">
          <div className="card-title" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 className="text-violet-400" size={20} />
              <span>Extracted Tech Stack & Taxonomy ({parsed.allSkills.length} Identified)</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <MousePointerClick size={14} />
              <span>Click any skill to inspect architecture & internals</span>
            </div>
          </div>

          {/* Side-by-Side Layout: Skills Taxonomy on Left, Inspector on Right */}
          <div className="tech-stack-split-layout">
            {/* Skills Taxonomy List */}
            <div className="skills-container" style={{ flex: '1 1 340px' }}>
              {parsed.skillCategories.map((cat, idx) => (
                <div key={idx} className="skill-category-block">
                  <div className="cat-heading">{cat.category}</div>
                  <div className="skill-pills">
                    {cat.skills.map((skill, sIdx) => {
                      const isSelected = selectedTech?.name.toLowerCase() === skill.toLowerCase();
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          className={`skill-pill-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSkillClick(skill)}
                          title={`Click to inspect ${skill} details`}
                        >
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side: Tech Stack Deep Inspector */}
            {selectedTech && (
              <div className="tech-inspector-wrapper" style={{ flex: '1 1 420px', minWidth: '320px' }}>
                <TechStackInspector
                  tech={selectedTech}
                  onClose={() => setSelectedTech(null)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatMeter: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="stat-item">
    <div className="stat-header">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}%</span>
    </div>
    <div className="meter-track">
      <div className="meter-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  </div>
);
