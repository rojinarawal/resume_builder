import Field from '../ui/Field';
import SectionHeader from '../ui/SectionHeader';
import { inputStyle } from '../ui/styles';

export default function BasicsForm({ data, onChange }) {
  // Helper: when one field changes, spread the old basics and override just that field
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
      <div className='grid gap-3'>
        <div className='grid grid-cols-2 gap-3'>
          <Field label='First Name' required>
            <input
              value={data.basics.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              placeholder='Jane'
              style={inputStyle}
            />
          </Field>
          <Field label='Last Name' required>
            <input
              value={data.basics.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              placeholder='Smith'
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label='Professional Title'>
          <input
            value={data.basics.jobTitle}
            onChange={(e) => update('jobTitle', e.target.value)}
            placeholder='Senior Software Engineer'
            style={inputStyle}
          />
        </Field>
        <div className='grid grid-cols-2 gap-3'>
          <Field label='Email' required>
            <input
              value={data.basics.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder='jane@example.com'
              style={inputStyle}
            />
          </Field>
          <Field label='Phone'>
            <input
              value={data.basics.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder='+1 555 000 0000'
              style={inputStyle}
            />
          </Field>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <Field label='Location'>
            <input
              value={data.basics.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder='San Francisco, CA'
              style={inputStyle}
            />
          </Field>
          <Field label='LinkedIn'>
            <input
              value={data.basics.linkedin}
              onChange={(e) => update('linkedin', e.target.value)}
              placeholder='linkedin.com/in/jane'
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label='GitHub / Portfolio'>
          <input
            value={data.basics.github}
            onChange={(e) => update('github', e.target.value)}
            placeholder='github.com/jane'
            style={inputStyle}
          />
        </Field>
      </div>
    </div>
  );
}
