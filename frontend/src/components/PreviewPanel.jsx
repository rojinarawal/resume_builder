export default function PreviewPanel({ data, scale, setScale }) {
  const { basics, summary, experience, education, skills, projects } = data;

  const name = [basics.firstName, basics.lastName].filter(Boolean).join(' ');

  return (
    <div
      style={{
        background: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar */}
      <div
        className='no-print flex items-center justify-between px-5 py-2 border-b'
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 10,
            color: 'var(--text-3)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Live Preview
        </span>
        <div className='flex items-center gap-2'>
          <ScaleBtn onClick={() => setScale((s) => Math.max(0.4, s - 0.05))}>
            −
          </ScaleBtn>
          <span
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              color: 'var(--text-3)',
              minWidth: 36,
              textAlign: 'center',
            }}
          >
            {Math.round(scale * 100)}%
          </span>
          <ScaleBtn onClick={() => setScale((s) => Math.min(1.1, s + 0.05))}>
            +
          </ScaleBtn>
        </div>
      </div>

      {/* Scrollable area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          padding: '32px 20px',
        }}
      >
        {/* The actual white resume document */}
        <div
          id='resume-doc'
          style={{
            width: 680,
            minHeight: 880,
            background: '#fff',
            color: '#111',
            padding: '52px 56px',
            fontFamily: 'Geist, sans-serif',
            boxShadow: '0 4px 60px rgba(0,0,0,0.6)',
            transformOrigin: 'top center',
            transform: `scale(${scale})`,
            flexShrink: 0,
          }}
        >
          {/* Header */}
          <div
            style={{
              marginBottom: 28,
              paddingBottom: 24,
              borderBottom: '1.5px solid #111',
            }}
          >
            <div
              style={{
                fontFamily: 'DM Serif Display',
                fontSize: 32,
                color: '#0a0a0b',
                lineHeight: 1.1,
              }}
            >
              {name || <em style={{ color: '#a1a1aa' }}>Your Name</em>}
            </div>
            {basics.jobTitle && (
              <div style={{ fontSize: 13, color: '#52525b', marginTop: 4 }}>
                {basics.jobTitle}
              </div>
            )}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px 18px',
                marginTop: 12,
                fontFamily: 'JetBrains Mono',
                fontSize: 12,
                color: '#3f3f46',
              }}
            >
              {basics.email && <span>✉ {basics.email}</span>}
              {basics.phone && <span>✆ {basics.phone}</span>}
              {basics.location && <span>⌖ {basics.location}</span>}
              {basics.linkedin && <span>in {basics.linkedin}</span>}
              {basics.github && <span>⌥ {basics.github}</span>}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <ResumeSection title='Summary'>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: '#3f3f46' }}>
                {summary}
              </p>
            </ResumeSection>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <ResumeSection title='Experience'>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#0a0a0b',
                      }}
                    >
                      {exp.role || 'Role'}
                    </span>
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: 10,
                        color: '#71717a',
                      }}
                    >
                      {[exp.start, exp.end].filter(Boolean).join(' – ')}
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 12, color: '#52525b', marginBottom: 5 }}
                  >
                    {exp.company}
                  </div>
                  {exp.bullets && (
                    <ul style={{ paddingLeft: 14 }}>
                      {exp.bullets
                        .split('\n')
                        .filter(Boolean)
                        .map((b, i) => (
                          <li
                            key={i}
                            style={{
                              fontSize: 12,
                              lineHeight: 1.6,
                              color: '#3f3f46',
                            }}
                          >
                            {b}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </ResumeSection>
          )}

          {/* Education */}
          {education.length > 0 && (
            <ResumeSection title='Education'>
              {education.map((edu) => (
                <div
                  key={edu.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {edu.degree || 'Degree'}
                    </div>
                    <div style={{ fontSize: 12, color: '#52525b' }}>
                      {edu.school}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: 10,
                      color: '#71717a',
                      textAlign: 'right',
                    }}
                  >
                    {edu.year}
                    {edu.gpa && (
                      <>
                        <br />
                        GPA: {edu.gpa}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </ResumeSection>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <ResumeSection title='Skills'>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px 24px',
                }}
              >
                {skills
                  .filter((s) => s.items.length)
                  .map((cat) => (
                    <div key={cat.id} style={{ fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: '#0a0a0b' }}>
                        {cat.category}:{' '}
                      </span>
                      <span style={{ color: '#3f3f46' }}>
                        {cat.items.join(', ')}
                      </span>
                    </div>
                  ))}
              </div>
            </ResumeSection>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <ResumeSection title='Projects'>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {proj.name || 'Project'}
                    </span>
                    <span
                      style={{
                        fontFamily: 'JetBrains Mono',
                        fontSize: 10,
                        color: '#71717a',
                      }}
                    >
                      {proj.tech}
                    </span>
                  </div>
                  {proj.url && (
                    <div style={{ fontSize: 12, color: '#52525b' }}>
                      {proj.url}
                    </div>
                  )}
                  {proj.desc && (
                    <p
                      style={{
                        fontSize: 12,
                        color: '#3f3f46',
                        lineHeight: 1.6,
                      }}
                    >
                      {proj.desc}
                    </p>
                  )}
                </div>
              ))}
            </ResumeSection>
          )}
        </div>
      </div>
    </div>
  );
}

function ResumeSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 9,
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#0a0a0b',
          marginBottom: 10,
          paddingBottom: 5,
          borderBottom: '1px solid #e4e4e7',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function ScaleBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        border: '1px solid var(--border)',
        background: 'transparent',
        color: 'var(--text-2)',
        cursor: 'pointer',
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  );
}
