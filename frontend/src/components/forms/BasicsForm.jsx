import Field from '../ui/Field.jsx';
import { fieldInputStyle } from '../ui/styles.js';

export default function BasicsForm({
  data,
  onChange,
  getError,
  getWarning,
  touch,
}) {
  function update(field, value) {
    onChange({ ...data.basics, [field]: value });
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Field label='Full Name' required error={getError('basics.fullName')}>
        <input
          value={data.basics?.fullName || ''}
          onChange={(e) => update('fullName', e.target.value)}
          onBlur={() => touch('basics.fullName')}
          placeholder='Jane Smith'
          style={fieldInputStyle(!!getError('basics.fullName'))}
        />
      </Field>

      <Field label='Email' required error={getError('basics.email')}>
        <input
          value={data.basics?.email || ''}
          onChange={(e) => update('email', e.target.value)}
          onBlur={() => touch('basics.email')}
          placeholder='jane@example.com'
          style={fieldInputStyle(!!getError('basics.email'))}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field
          label='Phone'
          error={getError('basics.phone')}
          warning={getWarning('basics.phone')}
        >
          <input
            value={data.basics?.phone || ''}
            onChange={(e) => update('phone', e.target.value)}
            onBlur={() => touch('basics.phone')}
            placeholder='+1 555 000 0000'
            style={fieldInputStyle(!!getError('basics.phone'))}
          />
        </Field>

        <Field label='Location' warning={getWarning('basics.location')}>
          <input
            value={data.basics?.location || ''}
            onChange={(e) => update('location', e.target.value)}
            placeholder='San Francisco, CA'
            style={fieldInputStyle(false)}
          />
        </Field>
      </div>

      <Field
        label='LinkedIn'
        error={getError('basics.linkedin')}
        warning={getWarning('basics.linkedin')}
      >
        <input
          value={data.basics?.linkedin || ''}
          onChange={(e) => update('linkedin', e.target.value)}
          onBlur={() => touch('basics.linkedin')}
          placeholder='linkedin.com/in/jane'
          style={fieldInputStyle(!!getError('basics.linkedin'))}
        />
      </Field>

      <Field label='GitHub'>
        <input
          value={data.basics?.github || ''}
          onChange={(e) => update('github', e.target.value)}
          placeholder='github.com/jane'
          style={fieldInputStyle(false)}
        />
      </Field>
    </div>
  );
}
