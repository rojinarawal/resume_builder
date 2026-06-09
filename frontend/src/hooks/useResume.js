import { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api.js';

/**
 * useResume — custom hook that manages all resume state and API calls
 *
 * Components that use this hook get:
 * - resumeData      → the current form data
 * - updateSection   → update one section of the resume
 * - saveResume      → POST or PUT to Django
 * - loadResume      → GET from Django
 * - isSaving        → boolean for loading state on save button
 * - isLoading       → boolean for loading state on fetch
 * - saveStatus      → 'SAVED' | 'UNSAVED' | 'ERROR'
 * - error           → error message if something went wrong
 */

const defaultData = {
  basics: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

const defaultSections = ['contact']; // only contact section is active by default'

export function useResume() {
  const [resumeData, setResumeData] = useState(defaultData);
  const [resumeId, setResumeId] = useState(null); // null means not saved to DB yet
  const [saveStatus, setSaveStatus] = useState('UNSAVED');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSections, setActiveSections] = useState(defaultSections);

  // Add this function — called when user picks a section from modal
  function addSection(sectionId) {
    setActiveSections((prev) => [...prev, sectionId]);
  }

  // Add this function — called when user removes a section
  function removeSection(sectionId) {
    setActiveSections((prev) => prev.filter((id) => id !== sectionId));
    // Also clear the data for that section
    setResumeData((prev) => ({
      ...prev,
      [sectionId]: [],
    }));
  }

  // Add this function — called when user drags to reorder
  function reorderSections(newOrder) {
    // Never let contact move from index 0
    setActiveSections([
      'contact',
      ...newOrder.filter((id) => id !== 'contact'),
    ]);
  }

  // Update one section without wiping the rest
  function updateSection(section, value) {
    setResumeData((prev) => ({ ...prev, [section]: value }));
    setSaveStatus('UNSAVED');
  }

  /**
   * Transforms our frontend data shape → Django API shape
   *
   * Frontend uses camelCase: firstName, jobTitle
   * Django uses snake_case: first_name, job_title
   *
   * This function is the bridge between the two worlds.
   * We never let this leak into components.
   */
  function toApiShape(data) {
    return {
      first_name: data.basics.firstName,
      last_name: data.basics.lastName,
      email: data.basics.email,
      phone: data.basics.phone,
      location: data.basics.location,
      linkedin: data.basics.linkedin,
      github: data.basics.github,
      experience: data.experience,
      education: data.education,
      skills: data.skills,
      projects: data.projects,
    };
  }

  /**
   * Transforms Django API shape → our frontend data shape
   * The reverse of toApiShape
   */
  function fromApiShape(apiData) {
    return {
      basics: {
        firstName: apiData.first_name || '',
        lastName: apiData.last_name || '',
        email: apiData.email || '',
        phone: apiData.phone || '',
        location: apiData.location || '',
        linkedin: apiData.linkedin || '',
        github: apiData.github || '',
      },
      experience: apiData.experience || [],
      education: apiData.education || [],
      skills: apiData.skills || [],
      projects: apiData.projects || [],
    };
  }

  // ─── Core save logic — reused by both saveResume and saveResumeWithPatch ──

  async function _save(dataToSave) {
    setIsSaving(true);
    setError(null);

    try {
      const payload = toApiShape(dataToSave);
      let saved;

      if (resumeId) {
        saved = await resumeAPI.update(resumeId, payload);
      } else {
        saved = await resumeAPI.create(payload);
        setResumeId(saved.id);
        localStorage.setItem('resumeId', saved.id);
      }

      setSaveStatus('SAVED');
    } catch (err) {
      setError(err.message);
      setSaveStatus('ERROR');
    } finally {
      setIsSaving(false);
    }
  }

  // ─── Save entire resume (header Save button) ───
  async function saveResume() {
    await _save(resumeData);
  }

  /**
   * saveResumeWithPatch — called when user saves a section in the modal
   *
   * Merges the changed section into current resumeData inline,
   * then immediately saves to Django without waiting for setState.
   *
   * Why not just call updateSection + saveResume?
   * Because setState is async — by the time saveResume runs,
   * resumeData still has the old value. We avoid that by building
   * updatedData ourselves and passing it directly to _save.
   */
  async function saveResumeWithPatch(dataKey, value) {
    // Build updated data inline — don't rely on setState timing
    const updatedData = { ...resumeData, [dataKey]: value };

    // Update UI state immediately so preview refreshes
    setResumeData(updatedData);
    setSaveStatus('UNSAVED');

    // Save the patched data directly to Django
    await _save(updatedData);
  }

  /**
   * Load resume from Django by id
   * Called on mount if we find a saved id in localStorage
   */
  async function loadResume(id) {
    setIsLoading(true);
    setError(null);

    try {
      const data = await resumeAPI.getOne(id);
      setResumeData(fromApiShape(data));
      setResumeId(data.id);
      setSaveStatus('SAVED');

      // Restore active sections from saved data
      // Any section that has data → add it to activeSections
      const restored = ['contact'];
      if (data.experience?.length) restored.push('experience');
      if (data.education?.length) restored.push('education');
      if (data.skills?.length) restored.push('skills');
      if (data.projects?.length) restored.push('projects');
      if (data.certifications?.length) restored.push('certifications');
      setActiveSections(restored);
    } catch (err) {
      setError(err.message);
      // If load fails, clear the bad id
      localStorage.removeItem('resumeId');
    } finally {
      setIsLoading(false);
    }
  }

  function clearAll() {
    setResumeData(defaultData);
    setResumeId(null);
    setSaveStatus('UNSAVED');
    setError(null);
    setActiveSections(defaultSections);
    localStorage.removeItem('resumeId');
  }

  // On first mount — check if user has a saved resume id
  // If yes, load it automatically from Django
  useEffect(() => {
    const savedId = localStorage.getItem('resumeId');
    if (savedId) {
      loadResume(savedId);
    }
  }, []); // empty array = run once on mount only

  return {
    resumeData,
    activeSections,
    addSection,
    removeSection,
    reorderSections,
    updateSection,
    saveResume,
    saveResumeWithPatch,
    loadResume,
    clearAll,
    resumeId,
    saveStatus,
    isSaving,
    isLoading,
    error,
  };
}
