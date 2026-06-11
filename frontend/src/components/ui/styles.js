// Base styles
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
  transition: 'border-color 0.15s',
};

export const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 80,
  lineHeight: 1.5,
};

// Error variant — call as a function
export const inputStyleError = {
  ...inputStyle,
  border: '1px solid var(--red)',
  boxShadow: '0 0 0 3px rgba(248,113,113,0.08)',
};

// Helper — picks correct style based on error state
export function fieldInputStyle(hasError) {
  return hasError ? inputStyleError : inputStyle;
}
