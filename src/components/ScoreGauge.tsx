import React from 'react';

interface ScoreGaugeProps {
  score: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = 'var(--accent-emerald)';
  let glowColor = 'var(--accent-emerald-glow)';
  let tagText = 'Excellent Match';
  let tagBg = 'rgba(16, 185, 129, 0.15)';
  let tagColor = '#34d399';

  if (score < 65) {
    strokeColor = 'var(--accent-rose)';
    glowColor = 'rgba(244, 63, 94, 0.25)';
    tagText = 'Needs Optimization';
    tagBg = 'rgba(244, 63, 94, 0.15)';
    tagColor = '#f87171';
  } else if (score < 80) {
    strokeColor = 'var(--accent-amber)';
    glowColor = 'rgba(245, 158, 11, 0.25)';
    tagText = 'Good Match';
    tagBg = 'rgba(245, 158, 11, 0.15)';
    tagColor = '#fbbf24';
  }

  return (
    <div className="score-circle-container">
      <svg className="score-svg" viewBox="0 0 160 160">
        <circle
          className="score-bg"
          r={normalizedRadius}
          cx="80"
          cy="80"
        />
        <circle
          className="score-progress"
          r={normalizedRadius}
          cx="80"
          cy="80"
          stroke={strokeColor}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, filter: `drop-shadow(0 0 8px ${glowColor})` }}
        />
      </svg>

      <div className="score-label">
        <span className="score-value">{score}</span>
        <span className="score-max">/ 100</span>
      </div>

      <div className="score-tag" style={{ background: tagBg, color: tagColor }}>
        {tagText}
      </div>
    </div>
  );
};
