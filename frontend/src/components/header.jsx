export default function Header({
  saveStatus,
  isSaving,
  onSave,
  onClear,
  onPrint,
}) {
  // Status dot color based on state
  const dotColor =
    {
      SAVED: 'var(--green)',
      UNSAVED: 'var(--text-3)',
      ERROR: 'var(--red)',
    }[saveStatus] || 'var(--text-3)';

  return (
    <header
      className='no-print flex items-center justify-between px-6 border-b'
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
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

      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-2'>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: dotColor,
              boxShadow:
                saveStatus === 'SAVED' ? `0 0 8px ${dotColor}` : 'none',
              transition: 'all 0.3s',
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
            {isSaving ? 'SAVING...' : saveStatus}
          </span>
        </div>

        <Btn onClick={onClear} variant='ghost'>
          Clear
        </Btn>

        {/* Disable save button while saving */}
        <Btn onClick={onSave} variant='ghost' disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Btn>

        <Btn onClick={onPrint} variant='primary'>
          Export PDF
        </Btn>
      </div>
    </header>
  );
}

function Btn({ onClick, variant, disabled, children }) {
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
    cursor: disabled ? 'not-allowed' : 'pointer',
    textTransform: 'uppercase',
    opacity: disabled ? 0.5 : 1,
    transition: 'opacity 0.15s',
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
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  );
}
