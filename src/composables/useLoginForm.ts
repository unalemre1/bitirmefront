import { ref, computed } from 'vue'
import { validators } from '../utils/validators'

interface LoginFormData {
  email: string
  password: string
}

export function useLoginForm() {
  const formData = ref<LoginFormData>({
    email: '',
    password: ''
  })

  const errors = ref<Partial<Record<keyof LoginFormData, string>>>({})
  const touched = ref<Partial<Record<keyof LoginFormData, boolean>>>({})

  const validateField = (field: keyof LoginFormData) => {
    errors.value[field] = ''

    if (field === 'email') {
      if (!formData.value.email) {
        errors.value.email = 'Kullanıcı adı alanı zorunludur'
      }
    }

    if (field === 'password') {
      if (!formData.value.password) {
        errors.value.password = 'Şifre alanı zorunludur'
      }
    }
  }

  const handleBlur = (field: keyof LoginFormData) => {
    touched.value[field] = true
    validateField(field)
  }

  const validateForm = () => {
    errors.value = {}
    
    if (!formData.value.email) {
      errors.value.email = 'Kullanıcı adı alanı zorunludur'
    }
    
    if (!formData.value.password) {
      errors.value.password = 'Şifre alanı zorunludur'
    }
  }

  const isValid = computed(() => {
    return (
      formData.value.email.trim() !== '' &&
      formData.value.password.trim() !== '' &&
      Object.keys(errors.value).length === 0
    )
  })

  return {
    formData,
    errors,
    handleBlur,
    validateForm,
    isValid
  }
}