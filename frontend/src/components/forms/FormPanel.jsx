import BasicsForm from './BasicsForm.jsx';
import SummaryForm from './SummaryForm.jsx';
import ExperienceForm from './ExperienceForm.jsx';
import EducationForm from './EducationForm.jsx';
import SkillsForm from './SkillsForm.jsx';
import ProjectsForm from './ProjectsForm.jsx';

const SECTIONS = [
  { id: 'basics', label: '01 Basics' },
  { id: 'summary', label: '02 Summary' },
  { id: 'experience', label: '03 Experience' },
  { id: 'education', label: '04 Education' },
  { id: 'skills', label: '05 Skills' },
  { id: 'projects', label: '06 Projects' },
];

// Maps each section id to its form component
const FORM_MAP = {
  basics: BasicsForm,
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  projects: ProjectsForm,
};

export default function FormPanel({
  data,
  activeSection,
  setActiveSection,
  updateSection,
}) {
  // Dynamically pick which form component to render
  const ActiveForm = FORM_MAP[activeSection];

  return (
    <div
      className='no-print flex flex-col overflow-hidden border-r'
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      {/* Section pills navigation */}
      <nav
        className='flex gap-1 px-4 py-3 border-b overflow-x-auto'
        style={{ borderColor: 'var(--border)', flexShrink: 0 }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              letterSpacing: '0.08em',
              padding: '4px 10px',
              borderRadius: 20,
              border: '1px solid',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              background:
                activeSection === s.id
                  ? 'rgba(228,213,183,0.12)'
                  : 'transparent',
              color: activeSection === s.id ? 'var(--accent)' : 'var(--text-3)',
              borderColor:
                activeSection === s.id ? 'var(--border-act)' : 'transparent',
            }}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Render whichever form is active */}
      <div className='flex-1 overflow-y-auto p-5'>
        <ActiveForm
          data={data}
          // Each form gets its own slice of data and an updater function
          // e.g. BasicsForm gets data.basics and calls updateSection('basics', newValue)
          onChange={(value) => updateSection(activeSection, value)}
        />
      </div>
    </div>
  );
}
