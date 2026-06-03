import SectionHeader from '../ui/SectionHeader';
import Field from '../ui/Field';

const textareaStyle = (hasError) => ({
  background: 'var(--surface-2)',
  border: `1px solid ${hasError ? 'var(--red)' : 'var(--border)'}`,
  borderRadius: 6,
  padding: '9px 12px',
  fontFamily: 'Geist, sans-serif',
  fontSize: 13,
  color: 'var(--text)',
  outline: 'none',
  width: '100%',
  resize: 'vertical',
  minHeight: 80,
  lineHeight: 1.5,
  transition: 'border-color 0.15s',
});

export default function SummaryForm({ data, onChange, getError, touch }) {
  const error = getError('summary');
  const count = data.summary.length;

  return (
    <div>
      <SectionHeader
        number='02'
        title='Summary'
        sub='2–3 sentences. Hiring managers read this first.'
      />
      <Field label='Professional Summary' error={error}>
        <textarea
          value={data.summary}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => touch('summary')}
          placeholder='Software engineer with 5+ years building scalable systems. Passionate about clean architecture and developer tooling. Open to senior and staff-level roles.'
          style={textareaStyle(!!error)}
          rows={6}
        />
      </Field>

      {/* Character counter — turns red when too short */}
      <div
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 10,
          color: count < 50 ? 'var(--red)' : 'var(--text-3)',
          textAlign: 'right',
          marginTop: 6,
          transition: 'color 0.15s',
        }}
      >
        {count} / 50 min
      </div>
    </div>
  );
}
