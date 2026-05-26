import Header from '../components/Header.jsx';
import FormPanel from '../components/forms/FormPanel.jsx';
import PreviewPanel from '../components/PreviewPanel.jsx';
import { useState } from 'react';

const defaultData = {
  basics: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

export default function EditorPage() {
  const [resumeData, setResumeData] = useState(defaultData);
  const [activeSection, setActiveSection] = useState('basics');
  const [scale, setScale] = useState(0.75);
  const [saveStatus, setSaveStatus] = useState('UNSAVED');

  function updateSection(section, value) {
    setResumeData((prev) => ({ ...prev, [section]: value }));
    setSaveStatus('UNSAVED');
  }

  function saveResume() {
    localStorage.setItem('resumeState', JSON.stringify(resumeData));
    setSaveStatus('SAVED');
  }

  function clearAll() {
    if (!window.confirm('Clear everything?')) return;
    setResumeData(defaultData);
    localStorage.removeItem('resumeState');
    setSaveStatus('UNSAVED');
  }

  return (
    <div
      className='grid h-screen'
      style={{ gridTemplateRows: '52px 1fr', background: 'var(--bg)' }}
    >
      <Header
        saveStatus={saveStatus}
        onSave={saveResume}
        onClear={clearAll}
        onPrint={() => window.print()}
      />
      <div
        className='grid overflow-hidden'
        style={{ gridTemplateColumns: '420px 1fr' }}
      >
        <FormPanel
          data={resumeData}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          updateSection={updateSection}
        />
        <PreviewPanel data={resumeData} scale={scale} setScale={setScale} />
      </div>
    </div>
  );
}
