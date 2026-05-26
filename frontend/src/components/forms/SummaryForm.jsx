import SectionHeader from '../ui/SectionHeader';
import Field from '../ui/Field';
import { textareaStyle } from '../ui/styles';

export default function SummaryForm({ data, onChange }) {
  return (
    <div>
      <SectionHeader
        number='02'
        title='Summary'
        sub='2–3 sentences. Hiring managers read this first.'
      />
      <Field label='Professional Summary'>
        <textarea
          value={data.summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Software engineer with 5+ years building scalable systems. Passionate about clean architecture and developer tooling. Open to senior and staff-level roles.'
          style={textareaStyle}
          rows={6}
        />
      </Field>

      {/* Character counter — small UX touch */}
      <div
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: 10,
          color: data.summary.length > 400 ? 'var(--red)' : 'var(--text-3)',
          textAlign: 'right',
          marginTop: 6,
        }}
      >
        {data.summary.length} / 400
      </div>
    </div>
  );
}
