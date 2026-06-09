import Field from '../ui/Field.jsx';
import EntryCard from '../ui/EntryCard.jsx';
import AddButton from '../ui/AddButton.jsx';
import { inputStyle } from '../ui/styles.js';
import { useDragToReorder } from '../../hooks/useDragToReorder.js';

function newCertification() {
  return { id: Date.now(), name: '', issuer: '', date: '', url: '' };
}

export default function CertificationsForm({ data, onChange }) {
  const certs = data.certifications || [];
  const { getDragProps, dragOverIndex } = useDragToReorder(certs, onChange);

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

            <Field label='Certification Name'>
              <input
                value={cert.name}
                onChange={(e) => update(cert.id, 'name', e.target.value)}
                placeholder='AWS Solutions Architect'
                style={inputStyle}
              />
            </Field>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              <Field label='Issuer'>
                <input
                  value={cert.issuer}
                  onChange={(e) => update(cert.id, 'issuer', e.target.value)}
                  placeholder='Amazon'
                  style={inputStyle}
                />
              </Field>
              <Field label='Date'>
                <input
                  value={cert.date}
                  onChange={(e) => update(cert.id, 'date', e.target.value)}
                  placeholder='Jun 2024'
                  style={inputStyle}
                />
              </Field>
            </div>
            <Field label='URL (optional)'>
              <input
                value={cert.url}
                onChange={(e) => update(cert.id, 'url', e.target.value)}
                placeholder='credential url'
                style={inputStyle}
              />
            </Field>
          </EntryCard>
        </div>
      ))}

      <AddButton onClick={add} label='Add Certification' />
    </div>
  );
}
