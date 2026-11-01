import React, { useState, useMemo } from 'react';
import { COMMON_QUESTIONS_DATA } from '../data/commonQuestions';
import {
  Search,
  Pin,
  Bookmark,
  Sparkles,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Filter,
  PenTool,
  Cpu,
  Code2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  Binary,
  Boxes,
  BrainCircuit,
  Database,
  Terminal,
  Globe,
  HardDrive
} from 'lucide-react';

export const CommonQuestionsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [showPinnedOnly, setShowPinnedOnly] = useState<boolean>(false);
  const [expandedAnswerIds, setExpandedAnswerIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<boolean>(false);

  // Flashcard Mode state
  const [isFlashcardMode, setIsFlashcardMode] = useState<boolean>(false);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState<boolean>(false);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});

  const categories = [
    'All',
    'SQL & Database Queries',
    'Data Structures',
    'OOPs & Design Patterns',
    'Operating Systems',
    'Computer Networks',
    'DBMS & Database Concepts',
    'Machine Learning & AI',
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const togglePin = (id: string) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAnswer = (id: string) => {
    setExpandedAnswerIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllAnswers = () => {
    if (expandedAnswerIds.size === filteredQuestions.length) {
      setExpandedAnswerIds(new Set());
    } else {
      setExpandedAnswerIds(new Set(filteredQuestions.map(q => q.id)));
    }
  };

  const filteredQuestions = useMemo(() => {
    return COMMON_QUESTIONS_DATA.filter(q => {
      if (selectedCategory !== 'All' && q.category !== selectedCategory) {
        return false;
      }

      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
      if (showPinnedOnly && !pinnedIds.has(q.id)) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchQ = q.question.toLowerCase().includes(query);
        const matchA = q.answer.toLowerCase().includes(query);
        const matchTag = q.contextTag.toLowerCase().includes(query);
        const matchCat = q.category.toLowerCase().includes(query);
        const matchCode = q.codeSnippet?.toLowerCase().includes(query) || q.queryExample?.toLowerCase().includes(query);
        if (!matchQ && !matchA && !matchTag && !matchCat && !matchCode) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, showPinnedOnly, pinnedIds, searchQuery]);

  const handleCopyQuestions = () => {
    const textToCopy = filteredQuestions
      .map((q, idx) => {
        const talkingPoints = q.keyTalkingPoints && q.keyTalkingPoints.length > 0
          ? `\nKey Points:\n${q.keyTalkingPoints.map(p => `  • ${p}`).join('\n')}`
          : '';
        const code = q.queryExample ? `\n\nSQL Code:\n${q.queryExample}` : q.codeSnippet ? `\n\nCode Solution:\n${q.codeSnippet}` : '';
        return `${idx + 1}. [${q.category}] (${q.difficulty}) [${q.contextTag}]\nQUESTION: ${q.question}\n\nMODEL ANSWER:\n${q.answer}${code}${talkingPoints}\n`;
      })
      .join('\n----------------------------------------\n\n');

    navigator.clipboard.writeText(`Common Technical Interview Questions & Answers:\n\n${textToCopy}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQuestions = () => {
    const content = `# Common Technical Interview Question Bank & Model Answers\n\n` +
      `Universal Technical Round Preparation (Independent of Resume)\n\n` +
      filteredQuestions
        .map((q, idx) => {
          const talkingPoints = q.keyTalkingPoints && q.keyTalkingPoints.length > 0
            ? `\n#### Key Must-Mention Concepts:\n${q.keyTalkingPoints.map(p => `- ${p}`).join('\n')}`
            : '';
          const code = q.queryExample
            ? `\n\`\`\`sql\n${q.queryExample}\n\`\`\`\n`
            : q.codeSnippet
            ? `\n\`\`\`javascript\n${q.codeSnippet}\n\`\`\`\n`
            : '';
          return `### ${idx + 1}. ${q.question}\n- **Category**: ${q.category}\n- **Difficulty**: ${q.difficulty}\n- **Topic Focus**: ${q.contextTag}\n\n#### Ideal Model Answer:\n${q.answer}\n${code}${talkingPoints}`;
        })
        .join('\n\n---\n\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Common_Technical_Interview_QA.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentFlashcard = filteredQuestions[currentFlashcardIndex] || filteredQuestions[0];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'SQL & Database Queries':
        return <Database size={14} className="text-cyan-400" />;
      case 'Data Structures':
        return <Binary size={14} className="text-pink-400" />;
      case 'OOPs & Design Patterns':
        return <Boxes size={14} className="text-indigo-400" />;
      case 'Operating Systems':
        return <Cpu size={14} className="text-cyan-400" />;
      case 'Computer Networks':
        return <Globe size={14} className="text-amber-400" />;
      case 'DBMS & Database Concepts':
        return <HardDrive size={14} className="text-emerald-400" />;
      case 'Machine Learning & AI':
        return <BrainCircuit size={14} className="text-purple-400" />;
      default:
        return <Code2 size={14} className="text-emerald-400" />;
    }
  };

  return (
    <div className="questions-container fade-in">
      {/* Universal Common Questions Header Banner */}
      <div className="ai-mode-banner local-active">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
            <Terminal size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
              Universal Technical Round Question Bank ({COMMON_QUESTIONS_DATA.length} Questions)
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Explore questions & ideal model answers across SQL queries, Data Structures, OOPs & Design Patterns, Operating Systems, Computer Networks, DBMS, and Machine Learning.
            </div>
          </div>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="questions-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div className="filter-group" style={{ flexWrap: 'wrap' }}>
            <Filter size={16} className="text-violet-400" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600 }}>Category:</span>
            {categories.map(cat => {
              const count = cat === 'All'
                ? COMMON_QUESTIONS_DATA.length
                : COMMON_QUESTIONS_DATA.filter(q => q.category === cat).length;

              return (
                <button
                  key={cat}
                  className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="export-bar">
          <button
            className="filter-btn"
            onClick={toggleAllAnswers}
            title="Expand or collapse all answers"
          >
            {expandedAnswerIds.size === filteredQuestions.length ? 'Collapse Answers' : 'Expand All Answers'}
          </button>

          <button
            className={`filter-btn ${showPinnedOnly ? 'active' : ''}`}
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Bookmark size={14} />
            <span>Pinned ({pinnedIds.size})</span>
          </button>

          <button
            className={`filter-btn ${isFlashcardMode ? 'active' : ''}`}
            onClick={() => {
              setIsFlashcardMode(!isFlashcardMode);
              setCurrentFlashcardIndex(0);
              setShowFlashcardAnswer(false);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Layers size={14} />
            <span>{isFlashcardMode ? 'List View' : 'Practice Flashcards'}</span>
          </button>

          <button className="btn-secondary" onClick={handleCopyQuestions} title="Copy Q&A to clipboard">
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Q&A'}</span>
          </button>

          <button className="btn-secondary" onClick={handleDownloadQuestions} title="Export Markdown Q&A Document">
            <Download size={14} />
            <span>Export Q&A MD</span>
          </button>
        </div>
      </div>

      {/* Difficulty & Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div className="filter-group">
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600 }}>Difficulty:</span>
          {difficulties.map(diff => (
            <button
              key={diff}
              className={`filter-btn ${selectedDifficulty === diff ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty(diff)}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search SQL queries, data structures, OS, networks, DBMS, OOPs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* FLASHCARD MODE */}
      {isFlashcardMode ? (
        filteredQuestions.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
            No questions match your filter parameters.
          </div>
        ) : (
          <div className="flashcard-wrapper fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span className={`category-tag ${currentFlashcard.category.replace(/[^a-zA-Z0-9]/g, '-')}`}>
                {getCategoryIcon(currentFlashcard.category)}
                <span>{currentFlashcard.category}</span>
              </span>
              <span className={`difficulty-pill ${currentFlashcard.difficulty}`}>
                {currentFlashcard.difficulty}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                • Focus: <strong>{currentFlashcard.contextTag}</strong>
              </span>
            </div>

            <div className="flashcard-question">
              "{currentFlashcard.question}"
            </div>

            <div>
              <button
                className="btn-upload"
                onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
              >
                <Lightbulb size={16} />
                <span>{showFlashcardAnswer ? 'Hide Solution & Answer' : 'Reveal Solution & Model Answer'}</span>
              </button>
            </div>

            {/* Answer Display */}
            {showFlashcardAnswer && (
              <div className="answer-box fade-in" style={{ width: '100%', maxWidth: '820px', textAlign: 'left' }}>
                <div className="answer-header">
                  <Lightbulb size={16} className="text-amber-400" />
                  <span style={{ fontWeight: 700 }}>Ideal Solution & Explanation:</span>
                </div>
                <div className="answer-body">
                  {currentFlashcard.answer}
                </div>

                {/* Code / Query Block */}
                {(currentFlashcard.queryExample || currentFlashcard.codeSnippet) && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '4px' }}>
                      {currentFlashcard.queryExample ? 'SQL Query Solution:' : 'Code Implementation:'}
                    </div>
                    <pre style={{
                      background: '#090d16',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 16px',
                      color: '#38bdf8',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {currentFlashcard.queryExample || currentFlashcard.codeSnippet}
                    </pre>
                  </div>
                )}

                {currentFlashcard.keyTalkingPoints && currentFlashcard.keyTalkingPoints.length > 0 && (
                  <div className="talking-points">
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                      Key Concepts to Highlight in Technical Interview:
                    </div>
                    <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.84rem' }}>
                      {currentFlashcard.keyTalkingPoints.map((point, pIdx) => (
                        <li key={pIdx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Candidate Practice Note Box */}
            <div style={{ width: '100%', maxWidth: '820px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <PenTool size={14} className="text-violet-400" />
                <span>Practice Query / Code Notes (Write your solution outline):</span>
              </label>
              <textarea
                value={userNotes[currentFlashcard.id] || ''}
                onChange={e => setUserNotes({ ...userNotes, [currentFlashcard.id]: e.target.value })}
                placeholder="Draft your SQL query, algorithm steps, or pseudo-code here..."
                style={{
                  width: '100%',
                  height: '90px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  padding: '12px',
                  fontFamily: 'inherit',
                  fontSize: '0.88rem',
                  resize: 'none',
                  outline: 'none',
                }}
              />
            </div>

            <div className="flashcard-nav">
              <button
                className="btn-secondary"
                disabled={currentFlashcardIndex === 0}
                onClick={() => {
                  setCurrentFlashcardIndex(prev => Math.max(0, prev - 1));
                  setShowFlashcardAnswer(false);
                }}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                {currentFlashcardIndex + 1} of {filteredQuestions.length}
              </span>
              <button
                className="btn-secondary"
                disabled={currentFlashcardIndex === filteredQuestions.length - 1}
                onClick={() => {
                  setCurrentFlashcardIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1));
                  setShowFlashcardAnswer(false);
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )
      ) : (
        /* STANDARD LIST VIEW WITH CODE HIGHLIGHTS */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredQuestions.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No common technical questions found matching selected filters.
            </div>
          ) : (
            filteredQuestions.map(q => {
              const isPinned = pinnedIds.has(q.id);
              const isAnswerExpanded = expandedAnswerIds.has(q.id);
              const sanitizedCatClass = q.category.replace(/[^a-zA-Z0-9]/g, '-');

              return (
                <div key={q.id} className="question-card">
                  <div className="question-header">
                    <div className="question-meta">
                      <span className={`category-tag ${sanitizedCatClass}`}>
                        {getCategoryIcon(q.category)}
                        <span>{q.category}</span>
                      </span>
                      <span className={`difficulty-pill ${q.difficulty}`}>{q.difficulty}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        className={`pin-btn ${isPinned ? 'pinned' : ''}`}
                        onClick={() => togglePin(q.id)}
                        title={isPinned ? 'Unpin question' : 'Pin question'}
                      >
                        <Pin size={16} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
                      </button>
                    </div>
                  </div>

                  <div className="question-text">
                    {q.question}
                  </div>

                  {/* Toggle Model Answer Button */}
                  <div>
                    <button
                      className="answer-toggle-btn"
                      onClick={() => toggleAnswer(q.id)}
                    >
                      <Lightbulb size={15} className={isAnswerExpanded ? 'text-amber-400' : 'text-muted'} />
                      <span>{isAnswerExpanded ? 'Hide Solution & Answer' : 'Show Solution, Query & Explanation'}</span>
                      {isAnswerExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>

                  {/* Expanded Answer Content */}
                  {isAnswerExpanded && (
                    <div className="answer-box fade-in">
                      <div className="answer-header">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Ideal Technical Solution:</span>
                      </div>
                      <div className="answer-body">
                        {q.answer}
                      </div>

                      {/* Code / Query Block if available */}
                      {(q.queryExample || q.codeSnippet) && (
                        <div style={{ marginTop: '6px' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '4px' }}>
                            {q.queryExample ? '⚡ SQL Query Solution:' : '⚡ Code Implementation:'}
                          </div>
                          <pre style={{
                            background: '#090d16',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '12px 16px',
                            color: '#38bdf8',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem',
                            overflowX: 'auto',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {q.queryExample || q.codeSnippet}
                          </pre>
                        </div>
                      )}

                      {q.keyTalkingPoints && q.keyTalkingPoints.length > 0 && (
                        <div className="talking-points">
                          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                            Key Concepts to Mention:
                          </div>
                          <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.84rem' }}>
                            {q.keyTalkingPoints.map((point, pIdx) => (
                              <li key={pIdx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="question-footer">
                    <div className="context-tag">
                      <Sparkles size={12} className="text-violet-400" />
                      <span>Focus: <strong>{q.contextTag}</strong></span>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      #{q.id}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
