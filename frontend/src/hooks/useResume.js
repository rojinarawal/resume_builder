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

export function useResume() {
  const [resumeData, setResumeData] = useState(defaultData);
  const [resumeId, setResumeId] = useState(null); // null means not saved to DB yet
  const [saveStatus, setSaveStatus] = useState('UNSAVED');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  /**
   * Save resume — smart save
   * If resumeId exists → PUT (update)
   * If no resumeId    → POST (create)
   *
   * This pattern is called "upsert" — update or insert
   */
  async function saveResume() {
    setIsSaving(true);
    setError(null);

    try {
      const payload = toApiShape(resumeData);
      let saved;

      if (resumeId) {
        // Already exists in DB — update it
        saved = await resumeAPI.update(resumeId, payload);
      } else {
        // First time saving — create it
        saved = await resumeAPI.create(payload);
        // Store the id so next save is a PUT not a POST
        setResumeId(saved.id);
        // Also persist id in localStorage so it survives page refresh
        localStorage.setItem('resumeId', saved.id);
      }

      setSaveStatus('SAVED');
    } catch (err) {
      setError(err.message);
      setSaveStatus('ERROR');
    } finally {
      // Always runs — whether success or error
      setIsSaving(false);
    }
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
    updateSection,
    saveResume,
    loadResume,
    clearAll,
    resumeId,
    saveStatus,
    isSaving,
    isLoading,
    error,
  };
}
