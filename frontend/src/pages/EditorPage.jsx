import Header from '../components/Header.jsx';
import FormPanel from '../components/forms/FormPanel.jsx';
import PreviewPanel from '../components/PreviewPanel.jsx';
import { useResume } from '../hooks/useResume.js';
import { useValidation } from '../hooks/useValidation.js';
import { useState } from 'react';
import { resumeAPI } from '../services/api.js';
import { sanitizeResume } from '../utils/sanitize.js';

export default function EditorPage() {
  const {
    resumeId,
    resumeData,
    setResumeData,
    updateSection,
    saveResume,
    saveResumeWithPatch,
    saveStatus,
    isSaving,
    isLoading,
    error,
    activeSections,
    addSection,
    removeSection,
    reorderSections,
    importResume,
  } = useResume();

  const [hasAttemptedSave, setHasAttemptedSave] = useState(false); // ← add this

  const { isValid, touchAll, getError, touch, resetTouched } =
    useValidation(resumeData);

  function handleSave() {
    if (!isValid) {
      touchAll();
      setHasAttemptedSave(true); // ← mark that user has attempted to save
      return;
    }
    saveResume();
    setHasAttemptedSave(false); // ← reset on successful save
  }

  function handleExport() {
    if (!resumeId) {
      // Resume not saved yet - save first then export
      alert('Please save your resume first before exporting.');
      return;
    }
    resumeAPI.exportPdf(resumeId);
  }

  function handleImport(parsedData) {
    // parsedData comes from Claude — it matches our resumeData shape exactly
    // Sanitize it first to ensure no undefined values
    const safe = sanitizeResume(parsedData);

    // Pre-fill the form
    setResumeData(safe); // ← need to expose this from useResume

    // Figure out which sections have data and activate them
    const sections = ['contact'];
    if (safe.experience?.length) sections.push('experience');
    if (safe.education?.length) sections.push('education');
    if (safe.skills?.length) sections.push('skills');
    if (safe.projects?.length) sections.push('projects');
    if (safe.certifications?.length) sections.push('certifications');
    importResume(safe, sections);
  }

  // Show loading screen while fetching saved resume
  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '2px solid var(--border)',
            borderTop: '2px solid var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 11,
            color: 'var(--text-3)',
            letterSpacing: '0.08em',
          }}
        >
          LOADING RESUME...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <div
      className='grid h-screen'
      style={{ gridTemplateRows: '52px 1fr', background: 'var(--bg)' }}
    >
      {/* Error banner — shows if API call failed */}
      {error && (
        <div
          style={{
            position: 'fixed',
            top: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid var(--red)',
            borderRadius: 6,
            padding: '8px 16px',
            zIndex: 100,
            fontFamily: 'JetBrains Mono',
            fontSize: 11,
            color: 'var(--red)',
            letterSpacing: '0.06em',
          }}
        >
          ⚠ {error}
        </div>
      )}

      <Header
        saveStatus={saveStatus}
        isSaving={isSaving}
        isValid={isValid}
        showErrors={hasAttemptedSave && !isValid}
        onSave={handleSave}
        onPrint={handleExport}
        onImport={handleImport}
      />
      <div
        className='grid overflow-hidden'
        style={{ gridTemplateColumns: '2fr 3fr' }}
      >
        <FormPanel
          data={resumeData}
          updateSection={updateSection}
          getError={getError}
          touch={touch}
          activeSections={activeSections}
          addSection={addSection}
          onSectionSave={saveResumeWithPatch} // ← save individual section immediately on edit
          removeSection={removeSection}
          reorderSections={reorderSections}
        />
        <PreviewPanel data={resumeData} activeSections={activeSections} />
      </div>
    </div>
  );
}
