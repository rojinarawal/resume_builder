import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api.js';
import {
  ArrowLeft,
  Loader,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Target,
} from 'lucide-react';

export default function AnalyzePage() {
  const navigate = useNavigate();
  const resumeId = localStorage.getItem('resumeId');

  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    if (!resumeId) {
      setError('Please save your resume first before analyzing.');
      return;
    }
    if (jobDescription.trim().length < 50) {
      setError(
        'Please paste the full job description (at least 50 characters).',
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await resumeAPI.analyzeResume(resumeId, jobDescription);
      setAnalysis(result.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 52,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
          gap: 16,
        }}
      >
        <button
          onClick={() => navigate('/editor')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-2)',
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          <ArrowLeft size={14} /> Back to Editor
        </button>
        <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text)',
          }}
        >
          ATS Analyzer
        </span>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Input section */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <h2
              style={{
                fontFamily: 'DM Serif Display',
                fontSize: 22,
                fontWeight: 400,
                color: 'var(--text)',
                marginBottom: 6,
              }}
            >
              Optimize for a Job
            </h2>
            <p
              style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}
            >
              Paste the job description below. The AI will analyze your resume
              against it and give you a score, missing keywords, and specific
              improvements.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 10,
                color: 'var(--text-3)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 8,
              }}
            >
              Job Description *
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder='Paste the full job description here — including requirements, responsibilities, and qualifications...'
              rows={8}
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '12px 14px',
                color: 'var(--text)',
                fontFamily: 'Geist, sans-serif',
                fontSize: 13,
                lineHeight: 1.6,
                resize: 'vertical',
                outline: 'none',
              }}
            />
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 10,
                color:
                  jobDescription.length < 50 ? 'var(--text-3)' : 'var(--green)',
                textAlign: 'right',
                marginTop: 4,
              }}
            >
              {jobDescription.length} characters
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: 8,
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                color: 'var(--red)',
                marginBottom: 16,
              }}
            >
              ⚠ {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isLoading || jobDescription.trim().length < 50}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              borderRadius: 8,
              background: 'var(--accent)',
              color: '#0a0a0b',
              border: 'none',
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading || jobDescription.trim().length < 50 ? 0.5 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {isLoading ? (
              <>
                <Loader
                  size={14}
                  style={{ animation: 'spin 0.8s linear infinite' }}
                />{' '}
                Analyzing...
              </>
            ) : (
              <>
                <Target size={14} /> Analyze Resume
              </>
            )}
          </button>
        </div>

        {/* Analysis results */}
        {analysis && <AnalysisResults analysis={analysis} />}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

// ── Analysis Results Component ─────────────────────────────────────────────

function AnalysisResults({ analysis }) {
  const scoreColor = (score) =>
    score >= 75 ? 'var(--green)' : score >= 50 ? '#f59e0b' : 'var(--red)';

  const priorityColor = {
    high: 'var(--red)',
    medium: '#f59e0b',
    low: 'var(--green)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ATS Score + breakdown */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          {/* Big score */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: scoreColor(analysis.ats_score),
                fontFamily: 'JetBrains Mono',
                lineHeight: 1,
                transition: 'color 0.3s',
              }}
            >
              {analysis.ats_score}
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 10,
                color: 'var(--text-3)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              ATS Score
            </div>
          </div>

          {/* Score breakdown */}
          <div style={{ flex: 1, minWidth: 200 }}>
            {Object.entries(analysis.score_breakdown || {}).map(
              ([key, score]) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: 10,
                        color: 'var(--text-2)',
                        letterSpacing: '0.06em',
                        textTransform: 'capitalize',
                      }}
                    >
                      {key}
                    </span>
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: 10,
                        color: scoreColor(score),
                      }}
                    >
                      {score}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: 'var(--surface-3)',
                      borderRadius: 999,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${score}%`,
                        background: scoreColor(score),
                        borderRadius: 999,
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Overall verdict */}
        {analysis.overall_verdict && (
          <div
            style={{
              marginTop: 20,
              padding: '12px 16px',
              background: 'var(--surface-2)',
              borderRadius: 8,
              fontSize: 13,
              color: 'var(--text-2)',
              lineHeight: 1.6,
              borderLeft: '3px solid var(--accent)',
            }}
          >
            {analysis.overall_verdict}
          </div>
        )}
      </div>

      {/* Keywords */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        {/* Matched */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14,
            }}
          >
            <CheckCircle size={16} color='var(--green)' />
            <span
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                color: 'var(--text)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Matched Keywords ({analysis.matched_keywords?.length || 0})
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(analysis.matched_keywords || []).map((kw, i) => (
              <span
                key={i}
                style={{
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: 'rgba(134,239,172,0.12)',
                  border: '1px solid rgba(134,239,172,0.3)',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 11,
                  color: 'var(--green)',
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14,
            }}
          >
            <XCircle size={16} color='var(--red)' />
            <span
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                color: 'var(--text)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Missing Keywords ({analysis.missing_keywords?.length || 0})
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(analysis.missing_keywords || []).map((kw, i) => (
              <span
                key={i}
                style={{
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.3)',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 11,
                  color: 'var(--red)',
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths */}
      {analysis.strengths?.length > 0 && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14,
            }}
          >
            <TrendingUp size={16} color='var(--green)' />
            <span
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                color: 'var(--text)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Strengths
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {analysis.strengths.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: 13,
                  color: 'var(--text-2)',
                  lineHeight: 1.5,
                }}
              >
                <CheckCircle
                  size={14}
                  color='var(--green)'
                  style={{ marginTop: 2, flexShrink: 0 }}
                />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {analysis.improvements?.length > 0 && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14,
            }}
          >
            <AlertTriangle size={16} color='#f59e0b' />
            <span
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                color: 'var(--text)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              Improvements Needed
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {analysis.improvements.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '14px 16px',
                  background: 'var(--surface-2)',
                  border: `1px solid ${priorityColor[item.priority]}33`,
                  borderLeft: `3px solid ${priorityColor[item.priority]}`,
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: 11,
                      color: 'var(--text)',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.section}
                  </span>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: 9,
                      color: priorityColor[item.priority],
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '2px 8px',
                      background: `${priorityColor[item.priority]}18`,
                      borderRadius: 20,
                    }}
                  >
                    {item.priority}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--text-3)',
                    marginBottom: 6,
                  }}
                >
                  {item.issue}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--text-2)',
                    lineHeight: 1.5,
                    paddingTop: 6,
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  💡 {item.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimized bullet points */}
      {analysis.optimized_bullets?.length > 0 && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14,
            }}
          >
            <TrendingUp size={16} color='var(--accent)' />
            <span
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 11,
                color: 'var(--text)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              AI-Optimized Bullet Points
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {analysis.optimized_bullets.map((bullet, i) => (
              <div
                key={i}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                <div
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(248,113,113,0.06)',
                    borderRadius: 6,
                    fontSize: 12,
                    color: 'var(--text-3)',
                    lineHeight: 1.5,
                    textDecoration: 'line-through',
                  }}
                >
                  {bullet.original}
                </div>
                <div
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(134,239,172,0.08)',
                    border: '1px solid rgba(134,239,172,0.2)',
                    borderRadius: 6,
                    fontSize: 12,
                    color: 'var(--text)',
                    lineHeight: 1.5,
                  }}
                >
                  {bullet.optimized}
                </div>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 10,
                    color: 'var(--text-3)',
                    letterSpacing: '0.04em',
                  }}
                >
                  ↑ {bullet.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
