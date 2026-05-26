import FormPanel from '../components/forms/FormPanel';
import Header from '../components/header';

export default function ResumePage({
  data,
  activeSection,
  setActiveSection,
  updateSection,
}) {
  return (
    <div className='min-h-screen flex flex-col bg-[var(--surface)] text-[var(--text)]'>
      <Header
        saveStatus={saveStatus}
        onSave={onSave}
        onClear={onClear}
        onPrint={onPrint}
      />

      {/* Main layout */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Left: Section Navigation (inside FormPanel) */}
        <FormPanel
          data={data}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          updateSection={updateSection}
        />
      </div>
    </div>
  );
}
