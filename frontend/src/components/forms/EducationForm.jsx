import Field from '../ui/Field';
import EntryCard from '../ui/EntryCard';
import AddButton from '../ui/AddButton';
import { inputStyle, fieldInputStyle } from '../ui/styles';

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

export default function EducationForm({
  data,
  onChange,
  getError,
  getWarning,
  touch,
}) {
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

  // Helper to get error/warning for a specific education field
  function getFieldError(index, field) {
    return getError?.(`education.${index}.${field}`);
  }

  function getFieldWarning(index, field) {
    return getWarning?.(`education.${index}.${field}`);
  }

  function touchField(index, field) {
    touch?.(`education.${index}.${field}`);
  }

  return (
    <div>
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
          <Field
            label='Degree & Major'
            required
            error={getFieldError(i, 'degree')}
          >
            <input
              value={edu.degree}
              onChange={(e) => update(edu.id, 'degree', e.target.value)}
              onBlur={() => touchField(i, 'degree')}
              placeholder='B.S. Computer Science'
              style={fieldInputStyle(!!getFieldError(i, 'degree'))}
            />
          </Field>

          <Field label='School' required error={getFieldError(i, 'school')}>
            <input
              value={edu.school}
              onChange={(e) => update(edu.id, 'school', e.target.value)}
              onBlur={() => touchField(i, 'school')}
              placeholder='MIT'
              style={fieldInputStyle(!!getFieldError(i, 'school'))}
            />
          </Field>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
          >
            <Field
              label='Graduation Year'
              required
              error={getFieldError(i, 'year')}
              warning={getFieldWarning(i, 'year')}
            >
              <input
                value={edu.year}
                onChange={(e) => update(edu.id, 'year', e.target.value)}
                onBlur={() => touchField(i, 'year')}
                placeholder='2022'
                style={fieldInputStyle(!!getFieldError(i, 'year'))}
              />
            </Field>

            <Field label='GPA (optional)' warning={getFieldWarning(i, 'gpa')}>
              <input
                value={edu.gpa}
                onChange={(e) => update(edu.id, 'gpa', e.target.value)}
                onBlur={() => touchField(i, 'gpa')}
                placeholder='3.9 / 4.0'
                style={fieldInputStyle(false)}
              />
            </Field>
          </div>
        </EntryCard>
      ))}

      <AddButton onClick={add} label='Add Education' />
    </div>
  );
}
