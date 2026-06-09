export default function PreviewPanel({ data, activeSections }) {
  const { basics } = data;

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
        {/* Resume document */}
        <div
          id='resume-doc'
          style={{
            width: 850,
            minHeight: 880,
            background: '#fff',
            color: '#111',
            borderRadius: 10,
            padding: '52px 56px',
            fontFamily: 'Geist, sans-serif',
            boxShadow: '0 4px 60px rgba(0,0,0,0.6)',
            transformOrigin: 'top center',
            flexShrink: 0,
          }}
        >
          {/* Personal info header — always first, always shown */}
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
                fontWeight: 600,
                color: '#0a0a0b',
                lineHeight: 1.1,
              }}
            >
              {basics.firstName} {basics.lastName}
            </div>
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

          {/*
            Sections rendered in EXACT order user arranged them.
            activeSections = ['contact', 'experience', 'education', ...]
            We skip 'contact' because it's the header above.
            renderSection() returns null if section has no data yet.
          */}
          {(activeSections || [])
            .filter((id) => id !== 'contact')
            .map((id) => (
              <div key={id}>{renderSection(id, data)}</div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ── Helper components ─────────────────────────────────────────────────────────

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

// Map section id → its render function
function renderSection(id, data) {
  const sectionRenderers = {
    experience: () =>
      data.experience?.length > 0 && (
        <ResumeSection title='Experience'>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  {exp.role}
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
              <div style={{ fontSize: 12, color: '#52525b', marginBottom: 5 }}>
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
      ),

    education: () =>
      data.education?.length > 0 && (
        <ResumeSection title='Education'>
          {data.education.map((edu) => (
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
                  {edu.degree}
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
      ),

    skills: () =>
      data.skills?.length > 0 && (
        <ResumeSection title='Skills'>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px 24px',
            }}
          >
            {data.skills
              .filter((s) => s.items?.length)
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
      ),

    projects: () =>
      data.projects?.length > 0 && (
        <ResumeSection title='Projects'>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  {proj.name}
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
                <div style={{ fontSize: 12, color: '#52525b' }}>{proj.url}</div>
              )}
              {proj.desc && (
                <p style={{ fontSize: 12, color: '#3f3f46', lineHeight: 1.6 }}>
                  {proj.desc}
                </p>
              )}
            </div>
          ))}
        </ResumeSection>
      ),

    certifications: () =>
      data.certifications?.length > 0 && (
        <ResumeSection title='Certifications'>
          {data.certifications.map((cert) => (
            <div
              key={cert.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{cert.name}</div>
                <div style={{ fontSize: 12, color: '#52525b' }}>
                  {cert.issuer}
                </div>
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: 10,
                  color: '#71717a',
                }}
              >
                {cert.date}
              </div>
            </div>
          ))}
        </ResumeSection>
      ),
  };

  const renderer = sectionRenderers[id];
  return renderer ? renderer() : null;
}
