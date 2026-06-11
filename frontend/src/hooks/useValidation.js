/**
 * useValidation — realistic resume validation
 *
 * Two types of feedback:
 * errors   → { path: 'error message' }  — must fix before saving
 * warnings → { path: 'warning message' } — should fix for better results
 */

import { useState } from 'react';

// ─── Pure validation rules ─────────────────────────────────────────────────

const rules = {
  required: (value) =>
    !value || !value.toString().trim() ? 'This field is required' : '',

  email: (value) =>
    value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? 'Enter a valid email address'
      : '',

  phone: (value) =>
    value && !/^[+\d\s\-().]{7,20}$/.test(value)
      ? 'Enter a valid phone number'
      : '',

  linkedin: (value) =>
    value && !/linkedin\.com/i.test(value)
      ? 'Should be a LinkedIn URL (linkedin.com/in/...)'
      : '',
};

// Maps sectionId → the dataKey it uses
const SECTION_TO_DATA_KEY = {
  contact: 'contact',
  experience: 'experience',
  education: 'education',
  skills: 'skills',
  projects: 'projects',
  certifications: 'certifications',
};

// ─── Error schema — fields that MUST be filled ────────────────────────────

function validateErrors(data, scope = null) {
  const errors = {};

  // Helper — should we validate this section?
  const should = (section) => scope === null || scope === section;

  // ── Contact ──────────────────────────────────────────────────────────────
  if (should('contact')) {
    if (!data.basics?.fullName?.trim())
      errors['basics.fullName'] = 'Full name is required';

    if (!data.basics?.email?.trim())
      errors['basics.email'] = 'Email is required';
    else if (rules.email(data.basics.email))
      errors['basics.email'] = rules.email(data.basics.email);

    if (data.basics?.phone && rules.phone(data.basics.phone))
      errors['basics.phone'] = rules.phone(data.basics.phone);

    if (data.basics?.linkedin && rules.linkedin(data.basics.linkedin))
      errors['basics.linkedin'] = rules.linkedin(data.basics.linkedin);
  }

  // Experience — each entry must have role, company, start, bullets
  const experienceList = Array.isArray(data.experience) ? data.experience : [];

  // ── Experience ────────────────────────────────────────────────────────────
  if (should('experience')) {
    const list = Array.isArray(data.experience) ? data.experience : [];
    list.forEach((exp, i) => {
      if (!exp.role?.trim())
        errors[`experience.${i}.role`] = 'Job title is required';
      if (!exp.company?.trim())
        errors[`experience.${i}.company`] = 'Company name is required';
      if (!exp.start?.trim())
        errors[`experience.${i}.start`] = 'Start date is required';
      if (!exp.bullets?.trim())
        errors[`experience.${i}.bullets`] = 'Add at least one bullet point';
    });
  }

  // ── Education ─────────────────────────────────────────────────────────────
  if (should('education')) {
    const list = Array.isArray(data.education) ? data.education : [];
    list.forEach((edu, i) => {
      if (!edu.degree?.trim())
        errors[`education.${i}.degree`] = 'Degree is required';
      if (!edu.school?.trim())
        errors[`education.${i}.school`] = 'School name is required';
    });
  }

  // ── Skills ────────────────────────────────────────────────────────────────
  if (should('skills')) {
    const list = Array.isArray(data.skills) ? data.skills : [];
    list.forEach((cat, i) => {
      if (!cat.category?.trim())
        errors[`skills.${i}.category`] = 'Category name is required';
    });
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  if (should('projects')) {
    const list = Array.isArray(data.projects) ? data.projects : [];
    list.forEach((proj, i) => {
      if (!proj.name?.trim())
        errors[`projects.${i}.name`] = 'Project name is required';
    });
  }

  // ── Certifications ────────────────────────────────────────────────────────
  if (should('certifications')) {
    const list = Array.isArray(data.certifications) ? data.certifications : [];
    list.forEach((cert, i) => {
      if (!cert.name?.trim())
        errors[`certifications.${i}.name`] = 'Certification name is required';
    });
  }

  return errors;
}

// ─── Warning schema — things that weaken the resume ───────────────────────

function validateWarnings(data, scope = null) {
  const warnings = {};
  const should = (section) => scope === null || scope === section;

  if (should('contact')) {
    if (!data.basics?.phone?.trim())
      warnings['basics.phone'] =
        'Adding a phone number increases callback rates';
    if (!data.basics?.location?.trim())
      warnings['basics.location'] =
        'Location helps recruiters find local candidates';
    if (!data.basics?.linkedin?.trim())
      warnings['basics.linkedin'] =
        'LinkedIn profile significantly boosts credibility';
  }

  if (should('experience')) {
    const list = Array.isArray(data.experience) ? data.experience : [];
    list.forEach((exp, i) => {
      if (exp.bullets) {
        const bulletList = exp.bullets.split('\n').filter((b) => b.trim());
        if (bulletList.length < 2)
          warnings[`experience.${i}.bullets`] =
            'Add at least 2 bullet points to show impact';
        const hasMetrics = bulletList.some((b) =>
          /\d+%|\$\d+|\d+x|\d+\s*(million|billion|k\b)|increased|reduced|improved/i.test(
            b,
          ),
        );
        if (!hasMetrics)
          warnings[`experience.${i}.metrics`] =
            'Add numbers to your bullets (e.g. "Increased performance by 40%")';
      }
      if (!exp.end?.trim())
        warnings[`experience.${i}.end`] =
          'Add end date or write "Present" for current role';
    });
  }

  if (should('education')) {
    const list = Array.isArray(data.education) ? data.education : [];
    list.forEach((edu, i) => {
      if (!edu.year?.trim())
        warnings[`education.${i}.year`] = 'Add graduation year';
    });
  }

  if (should('skills')) {
    const list = Array.isArray(data.skills) ? data.skills : [];
    list.forEach((cat, i) => {
      if ((cat.items || []).length < 2)
        warnings[`skills.${i}.items`] = 'Add at least 2 skills per category';
    });
    if (list.length > 0 && list.length < 2)
      warnings['skills.count'] =
        'Add more skill categories (Languages, Frameworks, Tools)';
  }

  if (should('projects')) {
    const list = Array.isArray(data.projects) ? data.projects : [];
    list.forEach((proj, i) => {
      if (!proj.desc?.trim())
        warnings[`projects.${i}.desc`] =
          'Add a description to explain the project impact';
      if (!proj.tech?.trim())
        warnings[`projects.${i}.tech`] = 'List the tech stack used';
    });
  }

  // Overall warnings — only when validating everything
  if (scope === null) {
    if ((data.experience || []).length === 0)
      warnings['overall.experience'] =
        'No work experience added — this significantly weakens your resume';
    if ((data.skills || []).length === 0)
      warnings['overall.skills'] =
        'No skills added — skills are one of the first things recruiters scan';
  }

  return warnings;
}

export function useValidation(resumeData, scope = null) {
  const [touched, setTouched] = useState({});

  const errors = validateErrors(resumeData, scope);
  const warnings = validateWarnings(resumeData, scope);
  const isValid = Object.keys(errors).length === 0;

  function touch(path) {
    setTouched((prev) => ({ ...prev, [path]: true }));
  }

  function touchAll() {
    const allTouched = {};
    Object.keys(errors).forEach((path) => {
      allTouched[path] = true;
    });
    setTouched(allTouched);
  }

  function resetTouched() {
    setTouched({});
  }

  function getError(path) {
    return touched[path] ? errors[path] || '' : '';
  }

  function getWarning(path) {
    return warnings[path] || '';
  }

  const totalChecks = Object.keys(errors).length + Object.keys(warnings).length;
  const healthScore =
    totalChecks === 0
      ? 100
      : Math.round(
          (1 - Object.keys(warnings).length / Math.max(totalChecks, 1)) * 100,
        );

  return {
    errors,
    warnings,
    touched,
    touch,
    touchAll,
    resetTouched,
    isValid,
    getError,
    getWarning,
    healthScore,
  };
}
