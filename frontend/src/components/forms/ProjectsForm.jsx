import SectionHeader from '../ui/SectionHeader';
import Field from '../ui/Field';
import { inputStyle, textareaStyle } from '../ui/styles';
import EntryCard from '../ui/EntryCard';
import AddButton from '../ui/AddButton';

function newProject() {
  return { id: Date.now(), name: '', tech: '', url: '', desc: '' };
}

function sanitizeProject(proj) {
  return {
    id: proj.id ?? Date.now(),
    name: proj.name ?? '',
    tech: proj.tech ?? '',
    url: proj.url ?? '',
    desc: proj.desc ?? '',
  };
}

export default function ProjectsForm({ data, onChange }) {
  const projects = Array.isArray(data.projects)
    ? data.projects.map(sanitizeProject)
    : [];

  function add() {
    onChange([...projects, newProject()]);
  }

  function remove(id) {
    onChange(projects.filter((p) => p.id !== id));
  }

  function update(id, field, value) {
    onChange(projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  return (
    <div>
      <SectionHeader
        number='06'
        title='Projects'
        sub='Pick projects that show depth and real-world impact.'
      />

      {projects.length === 0 && (
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-3)',
            marginBottom: 14,
            fontStyle: 'italic',
          }}
        >
          No projects added yet.
        </p>
      )}

      {projects.map((proj, i) => (
        <EntryCard
          key={proj.id}
          index={i}
          label='Project'
          onRemove={() => remove(proj.id)}
        >
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
          >
            <Field label='Project Name'>
              <input
                value={proj.name}
                onChange={(e) => update(proj.id, 'name', e.target.value)}
                placeholder='Distributed Cache'
                style={inputStyle}
              />
            </Field>
            <Field label='Tech Stack'>
              <input
                value={proj.tech}
                onChange={(e) => update(proj.id, 'tech', e.target.value)}
                placeholder='Go, Redis, Kubernetes'
                style={inputStyle}
              />
            </Field>
          </div>

          <Field label='URL (optional)'>
            <input
              value={proj.url}
              onChange={(e) => update(proj.id, 'url', e.target.value)}
              placeholder='github.com/you/project'
              style={inputStyle}
            />
          </Field>

          <Field label='Description'>
            <textarea
              value={proj.desc}
              onChange={(e) => update(proj.id, 'desc', e.target.value)}
              placeholder='Built a distributed caching layer handling 50k req/s with sub-5ms p99 latency.'
              style={textareaStyle}
              rows={3}
            />
          </Field>
        </EntryCard>
      ))}

      <AddButton onClick={add} label='Add Project' />
    </div>
  );
}
