// Shared input styles used across all forms

export const inputStyle = {
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  padding: '9px 12px',
  fontFamily: 'Geist, sans-serif',
  fontSize: 13,
  color: 'var(--text)',
  outline: 'none',
  width: '100%',
};

export const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 80,
  lineHeight: 1.5,
};
