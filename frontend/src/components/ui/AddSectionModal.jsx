import { SECTION_REGISTRY } from '../../config/section.js';
import { useEffect } from 'react';

export default function AddSectionModal({
  isOpen,
  onClose,
  activeSections,
  onAdd,
}) {
  // Sections not yet added — these are the options to show
  const available = SECTION_REGISTRY.filter(
    (s) => !s.locked && !activeSections.includes(s.id),
  );

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
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
          width: 380,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontFamily: 'DM Serif Display',
              fontSize: 20,
              fontWeight: 400,
              color: 'var(--text)',
              marginBottom: 4,
            }}
          >
            Add a section
          </h2>
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
            Choose what to include in your resume
          </p>
        </div>

        {/* Section options */}
        {available.length === 0 ? (
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-3)',
              textAlign: 'center',
              padding: '20px 0',
              fontStyle: 'italic',
            }}
          >
            All sections have been added
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {available.map((section) => {
              const Icon = section.icon;

              return (
                <button
                  key={section.id}
                  onClick={() => {
                    onAdd(section.id);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--surface-2)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.background = 'var(--accent-dim)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'var(--surface-2)';
                  }}
                >
                  {/* Icon */}
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'var(--surface-3)',
                      border: '1px solid var(--border)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {Icon && <Icon size={18} color='var(--text-2)' />}
                  </span>

                  {/* Label */}
                  <span
                    style={{
                      fontFamily: 'Geist, sans-serif',
                      fontSize: 13,
                      color: 'var(--text)',
                      fontWeight: 500,
                    }}
                  >
                    {section.label}
                  </span>

                  {/* Arrow */}
                  <span
                    style={{
                      marginLeft: 'auto',
                      color: 'var(--text-3)',
                      fontSize: 14,
                    }}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Cancel */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: 16,
            padding: '8px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--text-3)',
            fontFamily: 'JetBrains Mono',
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp {
          from { opacity:0; transform:translate(-50%,calc(-50% + 12px)) }
          to   { opacity:1; transform:translate(-50%,-50%) }
        }
      `}</style>
    </>
  );
}
