import SectionHeader from '../ui/SectionHeader';
import Field from '../ui/Field';
import { inputStyle } from '../ui/styles';
import AddButton from '../ui/AddButton';
import EntryCard from '../ui/EntryCard';
import { useState } from 'react';
import { useDragToReorder } from '../../hooks/useDragToReorder';

function newCategory() {
  return { id: Date.now(), category: '', items: [] };
}

// Sanitize a single skill category coming from API
// items might be missing or null
function sanitizeCategory(cat) {
  return {
    id: cat.id ?? Date.now(),
    category: cat.category ?? '',
    items: Array.isArray(cat.items) ? cat.items : [],
  };
}

export default function SkillsForm({ data, onChange }) {
  const skills = Array.isArray(data.skills)
    ? data.skills.map(sanitizeCategory)
    : [];

  // Local state just for the current text in each skill input box
  const [inputs, setInputs] = useState({});

  const { getDragProps, dragOverIndex } = useDragToReorder(
    skills,
    (reordered) => onChange(reordered),
  );

  function addCategory() {
    onChange([...skills, newCategory()]);
  }

  function removeCategory(id) {
    onChange(skills.filter((s) => s.id !== id));
  }

  function updateCategory(id, value) {
    onChange(skills.map((s) => (s.id === id ? { ...s, category: value } : s)));
  }

  // Add a skill tag to a category's items array
  function addItem(catId) {
    const val = (inputs[catId] || '').trim();
    if (!val) return;
    onChange(
      skills.map((s) =>
        s.id === catId ? { ...s, items: [...s.items, val] } : s,
      ),
    );
    setInputs((prev) => ({ ...prev, [catId]: '' }));
  }

  function removeItem(catId, itemIndex) {
    onChange(
      skills.map((s) =>
        s.id === catId
          ? { ...s, items: s.items.filter((_, i) => i !== itemIndex) }
          : s,
      ),
    );
  }

  return (
    <div>
      <SectionHeader
        number='05'
        title='Skills'
        sub='Group by category. Press Enter or + to add each skill.'
      />

      {skills.length === 0 && (
        <p
          style={{
            fontSize: 12,
            color: 'var(--text-3)',
            marginBottom: 14,
            fontStyle: 'italic',
          }}
        >
          No skills added yet. Add a category to get started.
        </p>
      )}

      {skills.map((cat, i) => (
        <div
          key={cat.id}
          {...getDragProps(i)}
          style={{
            opacity: dragOverIndex === i ? 0.5 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          <EntryCard
            index={i}
            label='Category'
            onRemove={() => removeCategory(cat.id)}
          >
            <Field label='Category Name'>
              <input
                value={cat.category}
                onChange={(e) => updateCategory(cat.id, e.target.value)}
                placeholder='Languages / Frameworks / Tools'
                style={inputStyle}
              />
            </Field>

            {/* Skill tags */}
            {cat.items.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {cat.items.map((item, j) => (
                  <span
                    key={j}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'var(--surface-3)',
                      border: '1px solid var(--border)',
                      borderRadius: 4,
                      padding: '3px 8px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: 11,
                      color: 'var(--text-2)',
                    }}
                  >
                    {item}
                    <button
                      onClick={() => removeItem(cat.id, j)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-3)',
                        cursor: 'pointer',
                        fontSize: 13,
                        lineHeight: 1,
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add skill input */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={inputs[cat.id] || ''}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))
                }
                onKeyDown={(e) => e.key === 'Enter' && addItem(cat.id)}
                placeholder='Type a skill and press Enter'
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={() => addItem(cat.id)}
                style={{
                  padding: '9px 14px',
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  color: 'var(--text-2)',
                  cursor: 'pointer',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 13,
                }}
              >
                +
              </button>
            </div>
          </EntryCard>
        </div>
      ))}

      <AddButton onClick={addCategory} label='Add Category' />
    </div>
  );
}
