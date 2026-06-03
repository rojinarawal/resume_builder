import SectionHeader from '../ui/SectionHeader.jsx';
import Field from '../ui/Field.jsx';

const inputStyle = (hasError) => ({
  background: 'var(--surface-2)',
  border: `1px solid ${hasError ? 'var(--red)' : 'var(--border)'}`,
  borderRadius: 6,
  padding: '9px 12px',
  fontFamily: 'Geist, sans-serif',
  fontSize: 13,
  color: 'var(--text)',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.15s',
});

export default function BasicsForm({ data, onChange, getError, touch }) {
  function update(field, value) {
    onChange({ ...data.basics, [field]: value });
  }

  return (
    <div>
      <SectionHeader
        number='01'
        title='Personal Info'
        sub='Your identity at the top of the resume'
      />

      <div style={{ display: 'grid', gap: 12 }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
        >
          <Field
            label='First Name'
            required
            error={getError('basics.firstName')}
          >
            <input
              value={data.basics.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              onBlur={() => touch('basics.firstName')}
              placeholder='Jane'
              style={inputStyle(!!getError('basics.firstName'))}
            />
          </Field>

          <Field label='Last Name' required error={getError('basics.lastName')}>
            <input
              value={data.basics.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              onBlur={() => touch('basics.lastName')}
              placeholder='Smith'
              style={inputStyle(!!getError('basics.lastName'))}
            />
          </Field>
        </div>

        <Field
          label='Professional Title'
          required
          error={getError('basics.jobTitle')}
        >
          <input
            value={data.basics.jobTitle}
            onChange={(e) => update('jobTitle', e.target.value)}
            onBlur={() => touch('basics.jobTitle')}
            placeholder='Senior Software Engineer'
            style={inputStyle(!!getError('basics.jobTitle'))}
          />
        </Field>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
        >
          <Field label='Email' required error={getError('basics.email')}>
            <input
              value={data.basics.email}
              onChange={(e) => update('email', e.target.value)}
              onBlur={() => touch('basics.email')}
              placeholder='jane@example.com'
              style={inputStyle(!!getError('basics.email'))}
            />
          </Field>

          <Field label='Phone'>
            <input
              value={data.basics.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder='+1 555 000 0000'
              style={inputStyle(false)}
            />
          </Field>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
        >
          <Field label='Location'>
            <input
              value={data.basics.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder='San Francisco, CA'
              style={inputStyle(false)}
            />
          </Field>
          <Field label='LinkedIn'>
            <input
              value={data.basics.linkedin}
              onChange={(e) => update('linkedin', e.target.value)}
              placeholder='linkedin.com/in/jane'
              style={inputStyle(false)}
            />
          </Field>
        </div>

        <Field label='GitHub / Portfolio'>
          <input
            value={data.basics.github}
            onChange={(e) => update('github', e.target.value)}
            placeholder='github.com/jane'
            style={inputStyle(false)}
          />
        </Field>
      </div>
    </div>
  );
}
