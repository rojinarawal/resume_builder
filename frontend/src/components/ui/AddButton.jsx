export default function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: 9,
        border: '1px dashed var(--border)',
        background: 'transparent',
        borderRadius: 10,
        color: 'var(--text-3)',
        fontFamily: 'JetBrains Mono',
        fontSize: 11,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.color = 'var(--accent)';
        e.currentTarget.style.background = 'var(--accent-dim)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.color = 'var(--text-3)';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      + {label}
    </button>
  );
}
