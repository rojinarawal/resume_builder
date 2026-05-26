// Props: saveStatus, onSave, onClear, onPrint
// "no-print" class hides this from the PDF export
export default function Header({ saveStatus, onSave, onClear, onPrint }) {
  return (
    <header
      className='no-print flex items-center justify-between px-6 border-b'
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className='flex items-center gap-3'>
        <div
          style={{
            width: 22,
            height: 22,
            background: 'var(--accent)',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
        />
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text)',
          }}
        >
          Resumé <span style={{ color: 'var(--text-3)' }}>v0.1</span>
        </span>
      </div>

      {/* Right side actions */}
      <div className='flex items-center gap-3'>
        {/* Save status indicator */}
        <div className='flex items-center gap-2'>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background:
                saveStatus === 'SAVED' ? 'var(--green)' : 'var(--text-3)',
              boxShadow:
                saveStatus === 'SAVED' ? '0 0 8px var(--green)' : 'none',
            }}
          />
          <span
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              color: 'var(--text-3)',
              letterSpacing: '0.06em',
            }}
          >
            {saveStatus}
          </span>
        </div>

        <Btn onClick={onClear} variant='ghost'>
          Clear
        </Btn>
        <Btn onClick={onSave} variant='ghost'>
          Save
        </Btn>
        <Btn onClick={onPrint} variant='primary'>
          Export PDF
        </Btn>
      </div>
    </header>
  );
}

// Small reusable button — notice how we compose styles based on variant prop
function Btn({ onClick, variant, children }) {
  const base = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 6,
    border: '1px solid',
    fontFamily: 'JetBrains Mono',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    textTransform: 'uppercase',
  };
  const variants = {
    ghost: {
      background: 'transparent',
      color: 'var(--text-2)',
      borderColor: 'var(--border)',
    },
    primary: {
      background: 'var(--accent)',
      color: '#0a0a0b',
      borderColor: 'var(--accent)',
    },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}
