export default function Field({ label, required, error, warning, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-3)',
        }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--accent)', marginLeft: 2 }}>*</span>
        )}
      </label>
      {children}

      {/* Error message — only renders if error string is non-empty */}
      {error && (
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 10,
            color: 'var(--red)',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ⚠ {error}
        </span>
      )}

      {/* Warning — amber, doesn't block save */}
      {!error && warning && (
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 10,
            color: '#f59e0b',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ◆ {warning}
        </span>
      )}
    </div>
  );
}
