import { useState, useRef } from 'react';
import { resumeAPI } from '../../services/api.js';
import { Upload, Loader } from 'lucide-react';

/**
 * ImportButton — lets user upload a PDF resume
 * Calls Claude API to parse it, returns structured data
 *
 * Props:
 * - onImport(data) → called with parsed resume data on success
 */
export default function ImportButton({ onImport }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await resumeAPI.importPdf(file);
      onImport(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      // Reset input so same file can be re-uploaded
      e.target.value = '';
    }
  }

  return (
    <div>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type='file'
        accept='.pdf'
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Visible button */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 6,
          border: '1px solid var(--border)',
          background: 'transparent',
          color: isLoading ? 'var(--text-3)' : 'var(--text-2)',
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.color = 'var(--accent)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-2)';
        }}
      >
        {isLoading ? (
          <Loader
            size={12}
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
        ) : (
          <Upload size={12} />
        )}
        {isLoading ? 'Parsing...' : 'Import PDF'}
      </button>

      {/* Error message */}
      {error && (
        <div
          style={{
            marginTop: 8,
            padding: '8px 12px',
            background: 'rgba(248,113,113,0.08)',
            border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: 6,
            fontFamily: 'JetBrains Mono',
            fontSize: 10,
            color: 'var(--red)',
            letterSpacing: '0.04em',
          }}
        >
          ⚠ {error}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}
