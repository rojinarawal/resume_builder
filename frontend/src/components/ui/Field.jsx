export default function Field({ label, required, children }) {
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
    </div>
  );
}
