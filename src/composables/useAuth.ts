import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { LoginCredentials, SignupCredentials } from '../types/auth';
import { authApi } from '../api/auth';

export const isAuthenticated = ref(false); // 🌍 Global auth state

export function useAuth() {
  const router = useRouter();
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('🔐 Login attempt:', credentials.email);
      isLoading.value = true;
      error.value = null;

      // Test credentials shortcut
      if (credentials.email === 'test@test.com' && credentials.password === 'test') {
        localStorage.setItem('access_token', 'test-token');
        isAuthenticated.value = true;
        router.push('/chat');
        return;
      }

      const response = await authApi.login(credentials);

      // Save token consistently as 'access_token'
      localStorage.setItem('access_token', response.access_token);
      isAuthenticated.value = true;
      router.push('/chat');
    } catch (err) {
      console.error('❌ Login error:', err);
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Giriş sırasında bir hata oluştu.';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      console.log('📝 Signup attempt:', credentials.email);
      isLoading.value = true;
      error.value = null;

      await authApi.signup(credentials);
      console.log('✅ Signup successful');

      // Otomatik login yapmak istersen aşağıyı aktif et:
      // await login({ email: credentials.email, password: credentials.password });

      router.push('/login');
    } catch (err) {
      console.error('❌ Signup error:', err);
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Kayıt sırasında bir hata oluştu.';
      }
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out');
      await authApi.logout();
      localStorage.removeItem('access_token');
      isAuthenticated.value = false;
      router.push('/login');
      console.log('✅ Logout successful');
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  };

  const verifyToken = async () => {
    try {
      console.log('🔎 Verifying token');
      const token = localStorage.getItem('access_token');
      if (!token) return false;

      if (token === 'test-token') return true;

      const isValid = await authApi.verifyToken();
      isAuthenticated.value = isValid;
      return isValid;
    } catch (err) {
      console.error('❌ Token verification failed:', err);
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
