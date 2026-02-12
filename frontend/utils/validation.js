/**
 * Client-side form validation utilities.
 * Mirrors Zod schemas on the backend for immediate UX feedback.
 */

export function validateEmail(email) {
  if (!email) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please provide a valid email';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
}

export function validateName(name) {
  if (!name) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (name.trim().length > 50) return 'Name must be at most 50 characters';
  return '';
}

export function validateLoginForm({ email, password }) {
  const errors = {};
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  return errors;
}

export function validateRegisterForm({ name, email, password }) {
  const errors = {};
  const nameErr = validateName(name);
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  return errors;
}

/**
 * Extracts the first error message from an Axios error response.
 */
export function getApiError(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
