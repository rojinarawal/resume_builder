import SectionHeader from '../ui/SectionHeader';
import Field from '../ui/Field';
import EntryCard from '../ui/EntryCard';
import AddButton from '../ui/AddButton';
import { inputStyle, textareaStyle } from '../ui/styles';

// Creates a blank experience object with a unique id
// Date.now() gives a unique number — good enough for a local id
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

export default function ExperienceForm({ data, onChange }) {
  const experiences = data.experience;

  // ADD — append a new blank entry to the array
  function add() {
    onChange([...experiences, newExperience()]);
  }

  // REMOVE — keep every entry except the one with this id
  function remove(id) {
    onChange(experiences.filter((exp) => exp.id !== id));
  }

  // UPDATE — map over the array, find the matching id, spread and override one field
  // This is the most important pattern — learn it deeply
  function update(id, field, value) {
    onChange(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    );
  }

  return (
    <div>
      <SectionHeader
        number='03'
        title='Work Experience'
        sub='Most recent first. Use bullet points with impact metrics.'
      />

      {experiences.length === 0 && (
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-3)',
            marginBottom: 14,
            fontStyle: 'italic',
          }}
        >
          No experience added yet. Click below to add your first role.
        </p>
      )}

      {experiences.map((exp, i) => (
        <EntryCard
          key={exp.id}
          index={i}
          label='Position'
          onRemove={() => remove(exp.id)}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
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

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
          >
            <Field label='Start Date'>
              <input
                value={exp.start}
                onChange={(e) => update(exp.id, 'start', e.target.value)}
                placeholder='Jan 2022'
                style={inputStyle}
              />
            </Field>
            <Field label='End Date'>
              <input
                value={exp.end}
                onChange={(e) => update(exp.id, 'end', e.target.value)}
                placeholder='Present'
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label='Bullet Points (one per line)'>
            <textarea
              value={exp.bullets}
              onChange={(e) => update(exp.id, 'bullets', e.target.value)}
              placeholder={`Led migration to microservices, reducing latency by 40%\nMentored 3 junior engineers\nShipped payment system handling $2M/day`}
              style={textareaStyle}
              rows={4}
            />
          </Field>
        </EntryCard>
      ))}

      <AddButton onClick={add} label='Add Position' />
    </div>
  );
}

