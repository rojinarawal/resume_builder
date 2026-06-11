import { useState } from 'react';
import BasicsForm from './BasicsForm.jsx';
import ExperienceForm from './ExperienceForm.jsx';
import EducationForm from './EducationForm.jsx';
import SkillsForm from './SkillsForm.jsx';
import ProjectsForm from './ProjectsForm.jsx';
import CertificationsForm from './CertificationsForm.jsx';
import AddSectionModal from '../ui/AddSectionModal.jsx';
import { SECTION_MAP } from '../../config/section.js';
import { useDragToReorder } from '../../hooks/useDragToReorder.js';
import SectionEditModal from '../../components/ui/SectionEditModal.jsx';
import { Pin, User } from 'lucide-react';

// Maps section id → its form component
const FORM_COMPONENTS = {
  contact: BasicsForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  projects: ProjectsForm,
  certifications: CertificationsForm,
};

// Maps section id → the key in resumeData it updates
const SECTION_TO_DATA_KEY = {
  contact: 'basics',
  experience: 'experience',
  education: 'education',
  skills: 'skills',
  projects: 'projects',
  certifications: 'certifications',
};

export default function FormPanel({
  data,
  updateSection,
  getError,
  touch,
  activeSections,
  onSectionSave,
  addSection,
  removeSection,
  reorderSections,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  // Filter sections to only show those that have data
  const sectionsWithData = activeSections.filter((id) => {
    const dataKey = SECTION_TO_DATA_KEY[id];
    if (!dataKey) return false;

    const sectionData = data[dataKey];

    // Contact section always shows (personal info)
    if (id === 'contact') return true;

    // For array-based sections, check if they have entries
    if (Array.isArray(sectionData)) {
      return sectionData.length > 0;
    }

    // For object-based sections (like basics), check if it's not empty
    if (typeof sectionData === 'object' && sectionData !== null) {
      return Object.keys(sectionData).some(
        (key) => sectionData[key] && String(sectionData[key]).trim() !== '',
      );
    }

    return false;
  });

  // Only non-locked sections can be reordered
  const draggableSections = sectionsWithData.filter(
    (id) => !SECTION_MAP[id]?.locked,
  );

  const { getDragProps, dragOverIndex } = useDragToReorder(
    draggableSections,
    (reordered) => reorderSections(reordered),
  );

  // How complete is each section — for the card subtitle
  function getSectionSummary(id) {
    switch (id) {
      case 'experience':
        return data.experience.length
          ? `${data.experience.length} position${data.experience.length > 1 ? 's' : ''}`
          : null;
      case 'education':
        return data.education.length
          ? `${data.education.length} degree${data.education.length > 1 ? 's' : ''}`
          : null;
      case 'skills':
        const totalSkills = data.skills.reduce(
          (acc, s) => acc + s.items.length,
          0,
        );
        return totalSkills > 0
          ? `${totalSkills} skill${totalSkills > 1 ? 's' : ''} added`
          : null;
      case 'projects':
        return data.projects.length
          ? `${data.projects.length} project${data.projects.length > 1 ? 's' : ''}`
          : null;
      case 'certifications':
        return data.certifications?.length
          ? `${data.certifications.length} certification${data.certifications.length > 1 ? 's' : ''}`
          : null;
      default:
        return null;
    }
  }

  return (
    <div
      className='no-print flex flex-col border-r'
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {/* LOCKED — Contact always shows (even if empty) */}
          <SectionCard
            icon={User}
            label='Personal Info'
            summary={getSectionSummary('contact')}
            locked={true}
            onClick={() => setEditingSection('contact')}
          />

          {/* DRAGGABLE sections - only show those with data */}
          {draggableSections.map((id, i) => {
            const section = SECTION_MAP[id];
            if (!section) return null;
            return (
              <div
                key={id}
                {...getDragProps(i)}
                style={{
                  opacity: dragOverIndex === i ? 0.4 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                <SectionCard
                  icon={section.icon}
                  label={section.label}
                  summary={getSectionSummary(id)}
                  locked={false}
                  onClick={() => setEditingSection(id)}
                  onRemove={() => removeSection(id)}
                />
              </div>
            );
          })}

          {/* Add Section button */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px dashed var(--border)',
              background: 'transparent',
              borderRadius: 10,
              color: 'var(--text-3)',
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
              e.currentTarget.style.background = 'rgba(228,213,183,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-3)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: 16 }}>+</span>
            Add Section
          </button>
        </div>
      </div>

      {/* Modals */}
      <AddSectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        activeSections={activeSections}
        onAdd={(id) => {
          addSection(id);
          setTimeout(() => setEditingSection(id), 100);
        }}
      />

      <SectionEditModal
        isOpen={!!editingSection}
        sectionId={editingSection}
        data={data}
        onSave={onSectionSave}
        onClose={() => setEditingSection(null)}
      />
    </div>
  );
}

function SectionCard({
  icon: Icon,
  label,
  summary,
  locked,
  onClick,
  onRemove,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-act)';
        e.currentTarget.style.background = 'var(--surface-3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.background = 'var(--surface)';
      }}
    >
      {/* Icon box */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={15} color='var(--text-2)' />}
      </div>

      {/* Drag handle or lock */}
      {locked ? (
        <Pin
          size={14}
          style={{
            flexShrink: 0,
            color: 'var(--text-3)',
          }}
        />
      ) : (
        <span
          style={{
            color: 'var(--text-3)',
            fontSize: 14,
            cursor: 'grab',
            flexShrink: 0,
          }}
        >
          ⠿
        </span>
      )}

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'Geist, sans-serif',
            fontSize: 13,
            color: 'var(--text)',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {label}
        </div>
        {summary && (
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 10,
              color: 'var(--text-3)',
              marginTop: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {summary}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
      >
        {!locked && onRemove && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-3)',
              fontSize: 15,
              transition: 'color 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red)')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = 'var(--text-3)')
            }
          >
            ×
          </span>
        )}
        <span style={{ color: 'var(--text-3)', fontSize: 13 }}>→</span>
      </div>
    </div>
  );
}
