import Header from '../components/Header.jsx';
import FormPanel from '../components/forms/FormPanel.jsx';
import PreviewPanel from '../components/PreviewPanel.jsx';
import { useResume } from '../hooks/useResume.js';
import { useValidation } from '../hooks/useValidation.js';
import { useState } from 'react';

export default function EditorPage() {
  const {
    resumeData,
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
  } = useResume();

  const { isValid, touchAll, getError, touch, resetTouched } =
    useValidation(resumeData);

  function handleSave() {
    if (!isValid) {
      touchAll();
      return;
    }
    saveResume();
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
        onSave={handleSave}
        onPrint={() => window.print()}
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
