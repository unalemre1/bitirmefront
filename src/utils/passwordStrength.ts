// import { computed } from 'vue' // 'computed' kaldırıldı

export interface PasswordStrength {
  score: number
  label: string
  color: string
}

const strengthLevels = [
  { score: 0, label: 'Çok Zayıf', color: '#ff4d4d' },
  { score: 25, label: 'Zayıf', color: '#ffa64d' },
  { score: 50, label: 'Orta', color: '#ffd700' },
  { score: 75, label: 'Güçlü', color: '#47d147' },
  { score: 100, label: 'Çok Güçlü', color: '#2eb82e' }
]

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) return strengthLevels[0]

  let score = 0
  
  // Length check
  score += Math.min(password.length * 5, 30)
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 15
  if (/[a-z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 20
  if (/[^A-Za-z0-9]/.test(password)) score += 20

  // Find appropriate strength level
  const strength = strengthLevels.reduce((prev, curr) => {
    return score >= curr.score ? curr : prev
  })

  return {
    score: Math.min(score, 100),
    label: strength.label,
    color: strength.color
  }
}