import { useState, useEffect } from 'react';
import BasicsForm from '../forms/BasicsForm.jsx';
import ExperienceForm from '../forms/ExperienceForm.jsx';
import EducationForm from '../forms/EducationForm.jsx';
import SkillsForm from '../forms/SkillsForm.jsx';
import ProjectsForm from '../forms/ProjectsForm.jsx';
import CertificationsForm from '../forms/CertificationsForm.jsx';
import { SECTION_MAP } from '../../config/section.js';
import { useValidation } from '../../hooks/useValidation.js';
import { sanitizeSection } from '../../utils/sanitize.js';

// Maps section id → its form component
const FORM_COMPONENTS = {
  contact: BasicsForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  projects: ProjectsForm,
  certifications: CertificationsForm,
};

// Maps section id → the key in resumeData it reads/writes
const SECTION_TO_DATA_KEY = {
  contact: 'basics',
  experience: 'experience',
  education: 'education',
  skills: 'skills',
  projects: 'projects',
  certifications: 'certifications',
};

/**
 * SectionEditModal
 *
 * Props:
 * - isOpen       → boolean
 * - sectionId    → which section is being edited e.g. 'experience'
 * - data         → full resumeData
 * - onSave       → called with (sectionId, newValue) when Save clicked
 * - onClose      → called when Cancel or backdrop clicked
 * - getError     → validation helper
 * - touch        → validation helper
 */
export default function SectionEditModal({
  isOpen,
  sectionId,
  data,
  onSave,
  onClose,
  getError,
  touch,
}) {
  const section = SECTION_MAP[sectionId];
  const Form = FORM_COMPONENTS[sectionId];
  const dataKey = SECTION_TO_DATA_KEY[sectionId];

  /**
   * localData — a copy of this section's data
   * User edits this freely without touching the real resumeData.
   * Only on Save do we commit to the real state.
   */
  const [localData, setLocalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const SectionIcon = section?.icon;

  // When modal opens — take a deep copy of the current section data
  // JSON parse/stringify is the simplest way to deep clone
  useEffect(() => {
    if (isOpen && data && dataKey) {
      setLocalData(sanitizeSection(sectionId, data[dataKey]));
      setHasChanges(false);
    }
  }, [isOpen, sectionId]);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !section || !Form || localData === null) return null;

  // When form fields change — update localData only
  function handleChange(value) {
    setLocalData(value);
    setHasChanges(true);
  }

  // Save — commit localData to real resumeData
  function handleSave() {
    onSave(dataKey, localData);
    onClose();
  }

  // Build a fake data object so forms can read from localData
  // Forms expect the full data object, so we merge localData into data
  const localDataObj = {
    ...data,
    [dataKey]: localData,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 200,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 201,
          width: 520,
          maxHeight: '80vh',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Modal header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Section icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              {SectionIcon && <SectionIcon size={16} color='var(--text-2)' />}
            </div>

            <div>
              <h2
                style={{
                  fontFamily: 'DM Serif Display',
                  fontSize: 18,
                  fontWeight: 400,
                  color: 'var(--text)',
                  margin: 0,
                }}
              >
                {section.label}
              </h2>
              {hasChanges && (
                <span
                  style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: 9,
                    color: 'var(--accent)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Unsaved changes
                </span>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-3)',
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-act)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-3)';
            }}
          >
            ×
          </button>
        </div>

        {/* Scrollable form content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--border) transparent',
          }}
        >
          <Form
            data={localDataObj}
            onChange={handleChange}
            getError={getError}
            touch={touch}
          />
        </div>

        {/* Footer actions */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'flex-end',
            padding: '16px 24px',
            borderTop: '1px solid var(--border)',
            flexShrink: 0,
            background: 'var(--surface-2)',
            borderRadius: '0 0 14px 14px',
          }}
        >
          {/* Cancel */}
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-2)',
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-act)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-2)';
            }}
          >
            Cancel
          </button>

          {/* Save Changes */}
          <button
            onClick={handleSave}
            style={{
              padding: '8px 20px',
              borderRadius: 6,
              border: '1px solid var(--accent)',
              background: hasChanges ? 'var(--accent)' : 'var(--surface-3)',
              color: hasChanges ? '#0a0a0b' : 'var(--text-3)',
              fontFamily: 'JetBrains Mono',
              fontSize: 11,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: 500,
            }}
          >
            {hasChanges ? 'Save Changes' : 'No Changes'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 } to { opacity: 1 }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)) }
          to   { opacity: 1; transform: translate(-50%, -50%) }
        }
      `}</style>
    </>
  );
}
