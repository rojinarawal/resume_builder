import { useEffect } from 'react';

/**
 * ConfirmModal — reusable confirmation dialog
 *
 * Props:
 * - isOpen     → boolean, controls visibility
 * - onConfirm  → called when user clicks confirm button
 * - onCancel   → called when user clicks cancel or backdrop
 * - title      → heading text
 * - message    → body description
 * - confirmLabel → text on confirm button (default: 'Confirm')
 * - isDanger   → boolean, makes confirm button red (default: true)
 */
export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = 'Confirm',
  isDanger = true,
}) {
  // Close on Escape key — expected UX behavior
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — click to cancel */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 201,
          width: 400,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '28px 28px 24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: isDanger
              ? 'rgba(248,113,113,0.1)'
              : 'rgba(228,213,183,0.1)',
            border: `1px solid ${isDanger ? 'rgba(248,113,113,0.2)' : 'rgba(228,213,183,0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            fontSize: 18,
          }}
        >
          {isDanger ? '⚠' : 'ℹ'}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: 20,
            fontWeight: 400,
            color: 'var(--text)',
            marginBottom: 8,
          }}
        >
          {title}
        </h2>

        {/* Message */}
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-2)',
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          {message}
        </p>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: 'var(--border)',
            marginBottom: 20,
          }}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          {/* Cancel */}
          <button
            onClick={onCancel}
            style={{
              padding: '8px 18px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-2)',
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--border-act)';
              e.target.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.color = 'var(--text-2)';
            }}
          >
            Cancel
          </button>

          {/* Confirm */}
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 18px',
              borderRadius: 6,
              border: `1px solid ${isDanger ? 'rgba(248,113,113,0.4)' : 'var(--accent)'}`,
              background: isDanger ? 'rgba(248,113,113,0.1)' : 'var(--accent)',
              color: isDanger ? 'var(--red)' : '#0a0a0b',
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDanger
                ? 'rgba(248,113,113,0.18)'
                : '#f0e4c8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDanger
                ? 'rgba(248,113,113,0.1)'
                : 'var(--accent)';
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)) }
          to   { opacity: 1; transform: translate(-50%, -50%) }
        }
      `}</style>
    </>
  );
}
