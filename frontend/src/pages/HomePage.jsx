import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: 40,
          height: 40,
          background: '#e4d5b7',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }}
      />

      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'DM Serif Display',
            fontSize: 48,
            color: '#fafafa',
            fontWeight: 400,
            marginBottom: 8,
          }}
        >
          Resumé
        </h1>
        <p
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 12,
            color: '#52525b',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Build a resume that gets you hired
        </p>
      </div>

      <button
        onClick={() => navigate('/editor')}
        style={{
          marginTop: 16,
          padding: '12px 32px',
          background: '#e4d5b7',
          color: '#0a0a0b',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontFamily: 'JetBrains Mono',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Start Building →
      </button>
    </div>
  );
}
