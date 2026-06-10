import { inputStyle, textareaStyle } from '../ui/styles';
import Field from '../ui/Field.jsx';
import EntryCard from '../ui/EntryCard.jsx';
import AddButton from '../ui/AddButton.jsx';
import { useDragToReorder } from '../../hooks/useDragToReorder.js';
import MonthPicker from '../../components/MonthPicker.jsx';

function newExperience() {
  return {
    id: Date.now(),
    role: '',
    company: '',
    start: '',
    end: '',
    bullets: '',
  };
}

// Sanitize a single experience entry coming from API
// Any field might be missing or null, so we provide defaults to ensure the form works smoothly
function sanitizeExperience(exp) {
  return {
    id: exp.id ?? Date.now(),
    role: exp.role ?? '',
    company: exp.company ?? '',
    start: exp.start ?? '',
    end: exp.end ?? '',
    bullets: exp.bullets ?? '',
  };
}

export default function ExperienceForm({ data, onChange, getError, touch }) {
  const experiences = Array.isArray(data.experience)
    ? data.experience.map(sanitizeExperience)
    : [];

  const { getDragProps, dragOverIndex } = useDragToReorder(
    experiences,
    (reordered) => onChange(reordered),
  );

  function add() {
    onChange([...experiences, newExperience()]);
  }
  function remove(id) {
    onChange(experiences.filter((e) => e.id !== id));
  }
  function update(id, field, value) {
    onChange(
      experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  }

  return (
    <div>
      {experiences.length === 0 && (
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-3)',
            marginBottom: 14,
            fontStyle: 'italic',
          }}
        >
          No experience added yet.
        </p>
      )}

      {experiences.map((exp, i) => (
        <div
          key={exp.id}
          {...getDragProps(i)}
          style={{
            opacity: dragOverIndex === i ? 0.5 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          <EntryCard index={i} label='Position' onRemove={() => remove(exp.id)}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '4px 0 10px',
                cursor: 'grab',
                userSelect: 'none',
                color: 'var(--text-3)',
              }}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='currentColor'
              >
                <circle cx='5' cy='4' r='1.2' />
                <circle cx='5' cy='8' r='1.2' />
                <circle cx='5' cy='12' r='1.2' />
                <circle cx='11' cy='4' r='1.2' />
                <circle cx='11' cy='8' r='1.2' />
                <circle cx='11' cy='12' r='1.2' />
              </svg>
              <span
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: 9,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                drag to reorder
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              <Field label='Role'>
                <input
                  value={exp.role}
                  onChange={(e) => update(exp.id, 'role', e.target.value)}
                  placeholder='Software Engineer'
                  style={inputStyle}
                />
              </Field>
              <Field label='Company'>
                <input
                  value={exp.company}
                  onChange={(e) => update(exp.id, 'company', e.target.value)}
                  placeholder='Google'
                  style={inputStyle}
                />
              </Field>
            </div>

            {/* ↓ Swapped from <input type="month"> to MonthPicker */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              <Field label='Start Date'>
                <MonthPicker
                  value={exp.start}
                  onChange={(v) => update(exp.id, 'start', v)}
                  placeholder='Start date'
                />
              </Field>
              <Field label='End Date'>
                <MonthPicker
                  value={exp.end}
                  onChange={(v) => update(exp.id, 'end', v)}
                  placeholder='Present'
                />
              </Field>
            </div>

            <Field label='Bullet Points (one per line)'>
              <textarea
                value={exp.bullets}
                onChange={(e) => update(exp.id, 'bullets', e.target.value)}
                placeholder={`Led migration to microservices, reducing latency by 40%\nMentored 3 junior engineers`}
                style={textareaStyle}
                rows={4}
              />
            </Field>
          </EntryCard>
        </div>
      ))}

      <AddButton onClick={add} label='Add Position' />
    </div>
  );
}
