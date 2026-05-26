import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
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
        gap: 16,
      }}
    >
      <span
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 72,
          color: '#27272a',
          fontWeight: 300,
        }}
      >
        404
      </span>
      <p
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 12,
          color: '#52525b',
          letterSpacing: '0.08em',
        }}
      >
        PAGE NOT FOUND
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: 8,
          padding: '8px 20px',
          background: 'transparent',
          color: '#a1a1aa',
          border: '1px solid #27272a',
          borderRadius: 6,
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          cursor: 'pointer',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        ← Go Home
      </button>
    </div>
  );
}
