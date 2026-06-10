/**
 * sanitizeResume — ensures resumeData always has the right shape
 *
 * Call this on EVERY piece of data before putting it in state.
 * Never trust data from an API, localStorage, or user input.
 */
export function sanitizeResume(raw = {}) {
  return {
    basics: {
      fullName: raw.basics?.fullName || '',
      email: raw.basics?.email || '',
      phone: raw.basics?.phone || '',
      location: raw.basics?.location || '',
      linkedin: raw.basics?.linkedin || '',
      github: raw.basics?.github || '',
    },
    experience: ensureArray(raw.experience),
    education: ensureArray(raw.education),
    skills: ensureArray(raw.skills),
    projects: ensureArray(raw.projects),
    certifications: ensureArray(raw.certifications),
  };
}

/**
 * sanitizeSection — ensures a single section is always the right type
 * Called before passing section data to a form
 */
export function sanitizeSection(sectionId, raw) {
  const arraySection = [
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
  ];

  if (arraySection.includes(sectionId)) {
    return ensureArray(raw);
  }

  // basics is an object
  if (sectionId === 'contact') {
    return {
      fullName: raw?.fullName || '',
      email: raw?.email || '',
      phone: raw?.phone || '',
      location: raw?.location || '',
      linkedin: raw?.linkedin || '',
      github: raw?.github || '',
    };
  }

  return raw;
}

// Private helper — never exposed
function ensureArray(val) {
  if (Array.isArray(val)) return val;
  if (val === null || val === undefined) return [];
  return [];
}
