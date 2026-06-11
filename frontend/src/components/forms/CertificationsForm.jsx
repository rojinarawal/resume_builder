import Field from '../ui/Field.jsx';
import EntryCard from '../ui/EntryCard.jsx';
import AddButton from '../ui/AddButton.jsx';
import { fieldInputStyle } from '../ui/styles.js';
import { useDragToReorder } from '../../hooks/useDragToReorder.js';

function newCertification() {
  return { id: Date.now(), name: '', issuer: '', date: '', url: '' };
}

function sanitizeCertification(cert) {
  return {
    id: cert.id ?? Date.now(),
    name: cert.name ?? '',
    issuer: cert.issuer ?? '',
    date: cert.date ?? '',
    url: cert.url ?? '',
  };
}

export default function CertificationsForm({
  data,
  onChange,
  getError,
  getWarning,
  touch,
}) {
  const certs = Array.isArray(data.certifications)
    ? data.certifications.map(sanitizeCertification)
    : [];

  const { getDragProps, dragOverIndex } = useDragToReorder(certs, (reordered) =>
    onChange(reordered),
  );

  function add() {
    onChange([...certs, newCertification()]);
  }
  function remove(id) {
    onChange(certs.filter((c) => c.id !== id));
  }
  function update(id, field, value) {
    onChange(certs.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  return (
    <div>
      {certs.length === 0 && (
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-3)',
            marginBottom: 14,
            fontStyle: 'italic',
          }}
        >
          No certifications added yet.
        </p>
      )}

      {certs.map((cert, i) => (
        <div
          key={cert.id}
          {...getDragProps(i)}
          style={{
            opacity: dragOverIndex === i ? 0.5 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          <EntryCard
            index={i}
            label='Certification'
            onRemove={() => remove(cert.id)}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '4px 0 10px',
                color: 'var(--text-3)',
                cursor: 'grab',
                userSelect: 'none',
                fontSize: 9,
                fontFamily: 'JetBrains Mono',
                letterSpacing: '0.08em',
              }}
            >
              ⠿ drag to reorder
            </div>

            <Field
              label='Certification Name'
              error={getError?.(`certifications.${i}.name`)}
              warning={getWarning?.(`certifications.${i}.name`)}
            >
              <input
                value={cert.name}
                onChange={(e) => update(cert.id, 'name', e.target.value)}
                onBlur={() => touch?.(`certifications.${i}.name`)}
                placeholder='AWS Solutions Architect'
                style={fieldInputStyle(
                  !!getError?.(`certifications.${i}.name`),
                )}
              />
            </Field>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              <Field
                label='Issuer'
                error={getError?.(`certifications.${i}.issuer`)}
                warning={getWarning?.(`certifications.${i}.issuer`)}
              >
                <input
                  value={cert.issuer}
                  onChange={(e) => update(cert.id, 'issuer', e.target.value)}
                  onBlur={() => touch?.(`certifications.${i}.issuer`)}
                  placeholder='Amazon'
                  style={fieldInputStyle(
                    !!getError?.(`certifications.${i}.issuer`),
                  )}
                />
              </Field>

              <Field
                label='Date'
                error={getError?.(`certifications.${i}.date`)}
                warning={getWarning?.(`certifications.${i}.date`)}
              >
                <input
                  value={cert.date}
                  onChange={(e) => update(cert.id, 'date', e.target.value)}
                  onBlur={() => touch?.(`certifications.${i}.date`)}
                  placeholder='Jun 2024'
                  style={fieldInputStyle(
                    !!getError?.(`certifications.${i}.date`),
                  )}
                />
              </Field>
            </div>

            <Field
              label='URL (optional)'
              error={getError?.(`certifications.${i}.url`)}
              warning={getWarning?.(`certifications.${i}.url`)}
            >
              <input
                value={cert.url}
                onChange={(e) => update(cert.id, 'url', e.target.value)}
                onBlur={() => touch?.(`certifications.${i}.url`)}
                placeholder='credential url'
                style={fieldInputStyle(!!getError?.(`certifications.${i}.url`))}
              />
            </Field>
          </EntryCard>
        </div>
      ))}

      <AddButton onClick={add} label='Add Certification' />
    </div>
  );
}
