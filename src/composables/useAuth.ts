import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { LoginCredentials, SignupCredentials } from '../types/auth';
import { authApi } from '../api/auth';

export const isAuthenticated = ref(false); // 🌍 GLOBAL STATE — Dışarı alındı

export function useAuth() {
  const router = useRouter();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('Login attempt with:', credentials.email);
      isLoading.value = true;
      error.value = null;

      // Check for test credentials
      if (credentials.email === 'test@test.com' && credentials.password === 'test') {
        console.log('Test login triggered');
        localStorage.setItem('token', 'test-token');
        isAuthenticated.value = true;
        router.push('/chat');
        return;
      }

      const response = await authApi.login(credentials);
      console.log('Login successful, received token');

      // BURASI GÜNCELLENDİ: response.access_token kullanılıyor
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        isAuthenticated.value = true;
        router.push('/chat');
      } else {
        // Eğer access_token gelmezse hata fırlat veya uyar
        console.warn('Login successful but no access_token received.');
        error.value = 'Giriş başarılı ancak oturum bilgisi alınamadı.';
        isAuthenticated.value = false; // Oturum açılmış sayma
      }

    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Giriş yapılırken bir hata oluştu';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      console.log('Signup attempt for:', credentials.email);
      isLoading.value = true;
      error.value = null;

      await authApi.signup(credentials);
      console.log('Signup successful');

      router.push('/login');
    } catch (err) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Kayıt olurken bir hata oluştu';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      console.log('Logout attempt');
      await authApi.logout();
      localStorage.removeItem('token');
      isAuthenticated.value = false;
      router.push('/login');
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const verifyToken = async () => {
    try {
      console.log('Verifying token');
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      if (token === 'test-token') {
        return true;
      }
      const isValid = await authApi.verifyToken();
      isAuthenticated.value = isValid;
      console.log('Token verification successful');
      return isValid;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  };

  return {
    login,
    signup,
    logout,
    verifyToken,
    isLoading,
    error,
    isAuthenticated,
  };
}