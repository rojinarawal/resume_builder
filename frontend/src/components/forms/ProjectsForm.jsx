import Field from '../ui/Field';
import { fieldInputStyle, textareaStyle } from '../ui/styles';
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

export default function ProjectsForm({
  data,
  onChange,
  getError,
  getWarning,
  touch,
}) {
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
            <Field
              label='Project Name'
              error={getError?.(`projects.${i}.name`)}
              warning={getWarning?.(`projects.${i}.name`)}
            >
              <input
                value={proj.name}
                onChange={(e) => update(proj.id, 'name', e.target.value)}
                onBlur={() => touch?.(`projects.${i}.name`)}
                placeholder='Distributed Cache'
                style={fieldInputStyle(!!getError?.(`projects.${i}.name`))}
              />
            </Field>
            <Field
              label='Tech Stack'
              error={getError?.(`projects.${i}.tech`)}
              warning={getWarning?.(`projects.${i}.tech`)}
            >
              <input
                value={proj.tech}
                onChange={(e) => update(proj.id, 'tech', e.target.value)}
                onBlur={() => touch?.(`projects.${i}.tech`)}
                placeholder='Go, Redis, Kubernetes'
                style={fieldInputStyle(!!getError?.(`projects.${i}.tech`))}
              />
            </Field>
          </div>

          <Field
            label='URL (optional)'
            error={getError?.(`projects.${i}.url`)}
            warning={getWarning?.(`projects.${i}.url`)}
          >
            <input
              value={proj.url}
              onChange={(e) => update(proj.id, 'url', e.target.value)}
              onBlur={() => touch?.(`projects.${i}.url`)}
              placeholder='github.com/you/project'
              style={fieldInputStyle(!!getError?.(`projects.${i}.url`))}
            />
          </Field>

          <Field
            label='Description'
            error={getError?.(`projects.${i}.desc`)}
            warning={getWarning?.(`projects.${i}.desc`)}
          >
            <textarea
              value={proj.desc}
              onChange={(e) => update(proj.id, 'desc', e.target.value)}
              onBlur={() => touch?.(`projects.${i}.desc`)}
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
