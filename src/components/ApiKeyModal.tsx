import React, { useState } from 'react';
import { X, Sparkles, Key, CheckCircle, AlertCircle, Loader2, ExternalLink, Trash2, Cpu, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { testAIConnection, type AIProvider, DEFAULT_GEMINI_API_KEY, DEFAULT_GROQ_API_KEY, DEFAULT_GEMINI_MODEL, DEFAULT_GROQ_MODEL } from '../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  provider: AIProvider;
  selectedModel: string;
  isGeminiEnabled: boolean;
  isGroqEnabled: boolean;
  onToggleGemini: (enabled: boolean) => void;
  onToggleGroq: (enabled: boolean) => void;
  onSaveConfig: (provider: AIProvider, key: string, model: string) => void;
  onClearKey: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey: initialKey,
  provider: initialProvider,
  selectedModel: initialModel,
  isGeminiEnabled,
  isGroqEnabled,
  onToggleGemini,
  onToggleGroq,
  onSaveConfig,
  onClearKey,
}) => {
  const [provider, setProvider] = useState<AIProvider>(initialProvider || 'gemini');
  const [keyInput, setKeyInput] = useState(() => {
    if (initialKey && initialKey.trim()) return initialKey;
    return initialProvider === 'groq' ? DEFAULT_GROQ_API_KEY : DEFAULT_GEMINI_API_KEY;
  });
  const [model, setModel] = useState(
    initialModel || (initialProvider === 'groq' ? DEFAULT_GROQ_MODEL : DEFAULT_GEMINI_MODEL)
  );
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleProviderChange = (newProvider: AIProvider) => {
    setProvider(newProvider);
    setTestResult(null);
    if (newProvider === 'gemini') {
      const saved = localStorage.getItem('gemini_api_key') || DEFAULT_GEMINI_API_KEY;
      setKeyInput(saved);
      setModel(DEFAULT_GEMINI_MODEL);
    } else if (newProvider === 'groq') {
      const saved = localStorage.getItem('groq_api_key') || DEFAULT_GROQ_API_KEY;
      setKeyInput(saved);
      setModel(DEFAULT_GROQ_MODEL);
    }
  };

  const handleTest = async () => {
    const activeKey = keyInput.trim() || (provider === 'groq' ? DEFAULT_GROQ_API_KEY : DEFAULT_GEMINI_API_KEY);

    setIsTesting(true);
    setTestResult(null);

    const result = await testAIConnection(provider, activeKey, model);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSave = () => {
    const activeKey = keyInput.trim() || (provider === 'groq' ? DEFAULT_GROQ_API_KEY : DEFAULT_GEMINI_API_KEY);
    onSaveConfig(provider, activeKey, model);
    onClose();
  };

  const handleClear = () => {
    setKeyInput('');
    setTestResult(null);
    onClearKey();
  };

  const getProviderHelpLink = () => {
    switch (provider) {
      case 'groq':
        return {
          url: 'https://console.groq.com/keys',
          label: 'Groq Cloud Console (console.groq.com) — Free 14,400 req/day',
        };
      default:
        return {
          url: 'https://aistudio.google.com/app/apikey',
          label: 'Google AI Studio (aistudio.google.com) — Free 1,500 req/day',
        };
    }
  };

  return (
    <div className="modal-backdrop fade-in" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon" style={{ width: '38px', height: '38px' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                AI Engine & Model Toggles
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Enable/Disable Gemini or Groq individually for your resume analysis
              </div>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Individual API Enable/Disable Switches */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
              Individual Model Activation:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                type="button"
                className={`filter-btn ${isGeminiEnabled ? 'active' : ''}`}
                onClick={() => onToggleGemini(!isGeminiEnabled)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={15} className="text-cyan-400" />
                  <span>Gemini (P1)</span>
                </div>
                {isGeminiEnabled ? <ToggleRight size={18} className="text-cyan-400" /> : <ToggleLeft size={18} />}
              </button>

              <button
                type="button"
                className={`filter-btn ${isGroqEnabled ? 'active' : ''}`}
                onClick={() => onToggleGroq(!isGroqEnabled)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={15} className="text-amber-400" />
                  <span>Groq (P2)</span>
                </div>
                {isGroqEnabled ? <ToggleRight size={18} className="text-amber-400" /> : <ToggleLeft size={18} />}
              </button>
            </div>
          </div>

          {/* Provider Selection Tabs for Key Config */}
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
              Configure API Key & Test Connection:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                type="button"
                className={`filter-btn ${provider === 'gemini' ? 'active' : ''}`}
                onClick={() => handleProviderChange('gemini')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 8px' }}
              >
                <Sparkles size={15} className="text-cyan-400" />
                <span>Google Gemini</span>
              </button>

              <button
                type="button"
                className={`filter-btn ${provider === 'groq' ? 'active' : ''}`}
                onClick={() => handleProviderChange('groq')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px 8px' }}
              >
                <Zap size={15} className="text-amber-400" />
                <span>Groq Cloud</span>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} className="text-violet-400" />
              <span>{provider === 'gemini' ? 'Gemini' : 'Groq'} API Key:</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', marginLeft: 'auto', fontWeight: 700 }}>
                ✓ Pre-saved in system
              </span>
            </label>
            <input
              type="password"
              className="search-input"
              style={{ paddingLeft: '14px', width: '100%', fontFamily: 'var(--font-mono)' }}
              placeholder={provider === 'groq' ? 'gsk_...' : 'AQ.Ab8... or AIza...'}
              value={keyInput}
              onChange={e => {
                setKeyInput(e.target.value);
                setTestResult(null);
              }}
            />
          </div>

          {/* Model Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} className="text-cyan-400" />
              <span>Preferred Model:</span>
            </label>
            <select
              className="search-input"
              style={{ paddingLeft: '14px', width: '100%' }}
              value={model}
              onChange={e => {
                setModel(e.target.value);
                setTestResult(null);
              }}
            >
              {provider === 'gemini' && (
                <>
                  <option value="gemini-flash-latest">Gemini Flash Latest (Recommended - Auto Load-Balanced)</option>
                  <option value="gemini-3.7-flash">Gemini 3.7 Flash (High Intelligence Tier)</option>
                  <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                </>
              )}
              {provider === 'groq' && (
                <>
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile (Recommended - High Intelligence)</option>
                  <option value="llama-3.1-8b-instant">Llama 3.1 8B Instant (Blazing Fast ~500 tok/s)</option>
                  <option value="gemma2-9b-it">Google Gemma 2 9B IT</option>
                </>
              )}
            </select>
          </div>

          {/* Test connection results */}
          {testResult && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                background: testResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                color: testResult.success ? '#a7f3d0' : '#fca5a5',
              }}
            >
              {testResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Key Management Instructions */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            <span>Need to generate or renew your API key? </span>
            <a
              href={getProviderHelpLink().url}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
            >
              {getProviderHelpLink().label} <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="modal-footer">
          <div style={{ display: 'flex', gap: '10px' }}>
            {keyInput && (
              <button className="btn-secondary" onClick={handleClear} style={{ color: '#f87171' }}>
                <Trash2 size={14} /> Clear
              </button>
            )}
            <button className="btn-secondary" onClick={handleTest} disabled={isTesting}>
              {isTesting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>Test Connection</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-upload" onClick={handleSave} style={{ padding: '8px 20px' }}>
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
