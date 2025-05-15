import { PASSWORD_REQUIREMENTS } from '../constants/passwordRequirements'

export interface PasswordValidationResult {
  isValid: boolean
  requirements: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecial: boolean
  }
}

export function validatePassword(password: string): PasswordValidationResult {
  const requirements = {
    minLength: password.length >= PASSWORD_REQUIREMENTS.minLength,
    hasUppercase: PASSWORD_REQUIREMENTS.requireUppercase ? /[A-Z]/.test(password) : true,
    hasLowercase: PASSWORD_REQUIREMENTS.requireLowercase ? /[a-z]/.test(password) : true,
    hasNumber: PASSWORD_REQUIREMENTS.requireNumber ? /[0-9]/.test(password) : true,
    hasSpecial: PASSWORD_REQUIREMENTS.requireSpecial ? /[!@#$%^&*]/.test(password) : true
  }

  const isValid = Object.values(requirements).every(Boolean)

  return {
    isValid,
    requirements
  }
}