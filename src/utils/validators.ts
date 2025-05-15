export const validators = {
  required: (value: string) => !!value.trim() || 'Bu alan zorunludur',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Geçerli bir e-posta adresi giriniz'
  },
  minLength: (length: number) => (value: string) => 
    value.length >= length || `En az ${length} karakter giriniz`,
  passwordMatch: (password: string, confirmPassword: string) =>
    password === confirmPassword || 'Şifreler eşleşmiyor',

  // Baro Sicil Numarası doğrulaması (5 haneli ve sadece rakamlardan oluşmalı)
  baroSicil: (value: string) => {
    const pattern = /^\d{5}$/; // Tam olarak 5 haneli rakamları doğrula
    return pattern.test(value) || 'Baro sicil numarası 5 haneli bir rakam olmalıdır';
  }
}
