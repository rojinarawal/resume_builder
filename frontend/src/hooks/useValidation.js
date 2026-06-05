import { useState, useEffect } from 'react';

/**
 * Validation rules — pure functions, no side effects
 * Each returns an error string if invalid, empty string if valid
 *
 * Pure functions are easy to test and reason about.
 * They take input, return output, nothing else.
 */
const rules = {
  required: (value) =>
    !value || !value.toString().trim() ? 'This field is required' : '',

  email: (value) =>
    value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? 'Enter a valid email address'
      : '',
};

/**
 * Schema — defines which fields are validated and how
 *
 * Each key maps to a field path in resumeData.
 * validators is an array — multiple rules can apply to one field.
 * The first failing rule wins.
 */
const schema = {
  // Basics
  'basics.firstName': {
    label: 'First Name',
    validators: [rules.required],
  },
  'basics.lastName': {
    label: 'Last Name',
    validators: [rules.required],
  },
  'basics.email': {
    label: 'Email',
    validators: [rules.required, rules.email],
  },
};

/**
 * Gets a nested value from an object using a dot-path string
 * e.g. getValue({ basics: { firstName: 'Jane' } }, 'basics.firstName') → 'Jane'
 */
function getValue(data, path) {
  return path.split('.').reduce((obj, key) => obj?.[key], data);
}

/**
 * Runs all validators for one field and returns the first error found
 */
function validateField(value, validators) {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return '';
}

/**
 * Validates all fields in the schema against current resumeData
 * Returns an object of { fieldPath: errorMessage }
 */
function validateAll(data) {
  const errors = {};
  for (const [path, { validators }] of Object.entries(schema)) {
    const value = getValue(data, path);
    const error = validateField(value, validators);
    if (error) errors[path] = error;
  }
  return errors;
}

/**
 * useValidation hook
 *
 * Returns:
 * - errors        → { 'basics.firstName': 'This field is required' }
 * - touched       → { 'basics.firstName': true } — tracks which fields user visited
 * - touch(path)   → mark a field as touched (call onBlur)
 * - isValid       → true if zero errors
 * - touchAll()    → mark everything touched (call on Save attempt)
 * - getError(path)→ returns error only if field is touched
 */
export function useValidation(resumeData) {
  // Which fields has the user interacted with
  const [touched, setTouched] = useState({});

  // Recompute errors every time resumeData changes
  const errors = validateAll(resumeData);
  const isValid = Object.keys(errors).length === 0;

  // Mark one field as touched — called onBlur in form inputs
  function touch(path) {
    setTouched((prev) => ({ ...prev, [path]: true }));
  }

  // Mark ALL fields as touched at once — called when Save is clicked
  // This makes all errors visible even if user never visited those fields
  function touchAll() {
    const allTouched = {};
    for (const path of Object.keys(schema)) {
      allTouched[path] = true;
    }
    setTouched(allTouched);
  }

  // Only show an error if the field has been touched
  // This prevents showing errors before the user even starts filling the form
  function getError(path) {
    return touched[path] ? errors[path] || '' : '';
  }

  function resetTouched() {
    setTouched({});
  }

  return { errors, touched, touch, isValid, touchAll, getError, resetTouched };
}
