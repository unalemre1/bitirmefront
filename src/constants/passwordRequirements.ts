export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true
}

export const PASSWORD_MESSAGES = {
  minLength: 'En az 8 karakter',
  uppercase: 'En az bir büyük harf (A-Z)',
  lowercase: 'En az bir küçük harf (a-z)',
  number: 'En az bir rakam (0-9)',
  special: 'En az bir özel karakter (!@#$%^&*)'
}