/**
 * Utility functions for authentication form validation.
 * Complies with strict separation of concerns and zero-emoji policy.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email address is required.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid dossier email address.' };
  }
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Keycode password is required.' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Keycode must be at least 8 characters in length.' };
  }
  return { isValid: true };
}

export function validateFullName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Full legal or dossier name is required.' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters.' };
  }
  return { isValid: true };
}

export function evaluatePasswordStrength(password: string): {
  hasLength: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  score: number;
} {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteria = [hasLength, hasUpper, hasNumber, hasSpecial];
  const score = criteria.filter(Boolean).length;

  return { hasLength, hasUpper, hasNumber, hasSpecial, score };
}
