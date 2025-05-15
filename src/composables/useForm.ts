import { ref, computed, watch } from 'vue'
import { validatePassword } from '../utils/passwordValidation'
import { validators } from '../utils/validators'

export interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
  password_confirm: string;
  baro_sicil_no: string;
}

export function useForm() {
  const formData = ref<FormData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    password_confirm: '',
    baro_sicil_no: ''
  })

  const errors = ref<Partial<Record<keyof FormData | 'idCardPhoto', string>>>({})

  const isValid = computed(() => {
    const passwordValidation = validatePassword(formData.value.password)
    return Object.keys(errors.value).length === 0 && passwordValidation.isValid
  })

  const resetForm = () => {
    formData.value = {
      name: '',
      surname: '',
      email: '',
      password: '',
      password_confirm: '',
      baro_sicil_no: ''
    }
    errors.value = {}
  }

  return {
    formData,
    errors,
    isValid,
    resetForm
  }
}