import SectionHeader from '../ui/SectionHeader';
import Field from '../ui/Field';
import EntryCard from '../ui/EntryCard';
import AddButton from '../ui/AddButton';
import { inputStyle } from '../ui/styles';

function newEducation() {
  return { id: Date.now(), degree: '', school: '', year: '', gpa: '' };
}

function sanitizeEducation(edu) {
  return {
    id: edu.id ?? Date.now(),
    degree: edu.degree ?? '',
    school: edu.school ?? '',
    year: edu.year ?? '',
    gpa: edu.gpa ?? '',
  };
}

export default function EducationForm({ data, onChange }) {
  const educations = Array.isArray(data.education)
    ? data.education.map(sanitizeEducation)
    : [];

  function add() {
    onChange([...educations, newEducation()]);
  }

  function remove(id) {
    onChange(educations.filter((edu) => edu.id !== id));
  }

  function update(id, field, value) {
    onChange(
      educations.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    );
  }

  return (
    <div>
      <SectionHeader
        number='04'
        title='Education'
        sub='Degrees and relevant certifications. Most recent first.'
      />

      {educations.length === 0 && (
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-3)',
            marginBottom: 14,
            fontStyle: 'italic',
          }}
        >
          No education added yet.
        </p>
      )}

      {educations.map((edu, i) => (
        <EntryCard
          key={edu.id}
          index={i}
          label='Degree'
          onRemove={() => remove(edu.id)}
        >
          <Field label='Degree & Major'>
            <input
              value={edu.degree}
              onChange={(e) => update(edu.id, 'degree', e.target.value)}
              placeholder='B.S. Computer Science'
              style={inputStyle}
            />
          </Field>

          <Field label='School'>
            <input
              value={edu.school}
              onChange={(e) => update(edu.id, 'school', e.target.value)}
              placeholder='MIT'
              style={inputStyle}
            />
          </Field>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
          >
            <Field label='Graduation Year'>
              <input
                value={edu.year}
                onChange={(e) => update(edu.id, 'year', e.target.value)}
                placeholder='2022'
                style={inputStyle}
              />
            </Field>
            <Field label='GPA (optional)'>
              <input
                value={edu.gpa}
                onChange={(e) => update(edu.id, 'gpa', e.target.value)}
                placeholder='3.9 / 4.0'
                style={inputStyle}
              />
            </Field>
          </div>
        </EntryCard>
      ))}

      <AddButton onClick={add} label='Add Education' />
    </div>
  );
}
