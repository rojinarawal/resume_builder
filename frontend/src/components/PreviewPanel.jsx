export default function PreviewPanel({ data, activeSections }) {
  const basics = data?.basics || {};

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        background: 'var(--color-background-tertiary, #f4f4f5)',
      }}
    >
      {/* Toolbar */}
      <div
        className='no-print'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          background: 'var(--color-background-secondary, #fafafa)',
          borderBottom: '0.5px solid var(--color-border-tertiary, #e4e4e7)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
            fontSize: 11,
            color: 'var(--color-text-tertiary, #a1a1aa)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Live Preview
        </span>
      </div>

      {/* Scrollable canvas */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '32px 20px',
          minHeight: 0,
        }}
      >
        {/* Resume paper — always white, hardcoded colors intentional */}
        <div
          id='resume-doc'
          style={{
            width: 760,
            minHeight: 'calc(100vh - 130px)',
            background: '#ffffff',
            color: '#111111',
            borderRadius: 8,
            padding: '52px 56px',
            boxShadow: '0 2px 40px rgba(0,0,0,0.15)',
            flexShrink: 0,
          }}
        >
          {/* ── Header (always shown) ── */}
          <div
            style={{
              marginBottom: 28,
              paddingBottom: 20,
              borderBottom: '2px solid #111111',
            }}
          >
            {/* Name */}
            <div
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 30,
                fontWeight: 700,
                color: '#0a0a0b',
                lineHeight: 1.1,
                letterSpacing: '-0.3px',
              }}
            >
              {basics.fullName || (
                <span style={{ color: '#a1a1aa', fontStyle: 'italic' }}>
                  Your Name
                </span>
              )}
            </div>

            {/* Job title / headline */}
            {basics.headline && (
              <div
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 13,
                  fontStyle: 'italic',
                  color: '#52525b',
                  marginTop: 4,
                }}
              >
                {basics.headline}
              </div>
            )}

            {/* Contact row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px 16px',
                marginTop: 10,
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 11,
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

          {/* ── Sections in user-defined order ── */}
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

// ── Shared section wrapper ────────────────────────────────────────────────────

function ResumeSection({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {/* Section heading */}
      <div
        style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#0a0a0b',
          marginBottom: 10,
          paddingBottom: 5,
          borderBottom: '1px solid #d4d4d8',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

// ── Section renderers ─────────────────────────────────────────────────────────

function renderSection(id, data) {
  const renderers = {
    summary: () =>
      data.summary && (
        <ResumeSection title='Summary'>
          <p
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: 12,
              lineHeight: 1.7,
              color: '#3f3f46',
              margin: 0,
            }}
          >
            {data.summary}
          </p>
        </ResumeSection>
      ),

    experience: () =>
      data.experience?.length > 0 && (
        <ResumeSection title='Experience'>
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              {/* Role + dates */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0a0a0b',
                  }}
                >
                  {exp.role}
                </span>
                <span
                  style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 10,
                    color: '#71717a',
                    whiteSpace: 'nowrap',
                    marginLeft: 12,
                  }}
                >
                  {[exp.start, exp.end].filter(Boolean).join(' – ')}
                </span>
              </div>

              {/* Company */}
              <div
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 12,
                  fontStyle: 'italic',
                  color: '#52525b',
                  margin: '2px 0 6px',
                }}
              >
                {exp.company}
              </div>

              {/* Bullet points */}
              {exp.bullets && (
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  {exp.bullets
                    .split('\n')
                    .filter(Boolean)
                    .map((b, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: 'Arial, sans-serif',
                          fontSize: 12,
                          lineHeight: 1.65,
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
                alignItems: 'flex-start',
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0a0a0b',
                  }}
                >
                  {edu.degree}
                </div>
                <div
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 12,
                    color: '#52525b',
                    marginTop: 1,
                  }}
                >
                  {edu.school}
                </div>
              </div>
              <div
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: 10,
                  color: '#71717a',
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                  marginLeft: 12,
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
                <div
                  key={cat.id}
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 12,
                    color: '#3f3f46',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#0a0a0b' }}>
                    {cat.category}:{' '}
                  </span>
                  {cat.items.join(', ')}
                </div>
              ))}
          </div>
        </ResumeSection>
      ),

    projects: () =>
      data.projects?.length > 0 && (
        <ResumeSection title='Projects'>
          {data.projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: 14 }}>
              {/* Name + tech stack */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0a0a0b',
                  }}
                >
                  {proj.name}
                </span>
                <span
                  style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 10,
                    color: '#71717a',
                    whiteSpace: 'nowrap',
                    marginLeft: 12,
                  }}
                >
                  {proj.tech}
                </span>
              </div>

              {/* URL */}
              {proj.url && (
                <div
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 11,
                    color: '#52525b',
                    margin: '1px 0 3px',
                  }}
                >
                  {proj.url}
                </div>
              )}

              {/* Description */}
              {proj.desc && (
                <p
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 12,
                    color: '#3f3f46',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
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
                alignItems: 'flex-start',
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0a0a0b',
                  }}
                >
                  {cert.name}
                </div>
                <div
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 12,
                    color: '#52525b',
                    marginTop: 1,
                  }}
                >
                  {cert.issuer}
                </div>
              </div>
              <div
                style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: 10,
                  color: '#71717a',
                  whiteSpace: 'nowrap',
                  marginLeft: 12,
                }}
              >
                {cert.date}
              </div>
            </div>
          ))}
        </ResumeSection>
      ),
  };

  const renderer = renderers[id];
  return renderer ? renderer() : null;
}
