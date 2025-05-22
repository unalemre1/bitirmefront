import type { LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';
import axios from '../config/axios';
import { handleApiError } from '../utils/errorHandler';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Making login API request');

      const formData = new FormData();
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);

      const { data } = await axios.post<AuthResponse>('auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 🔐 Login sonrası token'ı localStorage'a kaydet
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        console.log('✅ access_token saved to localStorage');
      } else {
        console.warn('⚠️ access_token not found in response');
      }

      console.log('Login API response received ✅');
      console.log('🔐 access_token:', data.access_token); // 👈 TOKEN LOGU

      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw handleApiError(error);
    }
  },

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      console.log('📝 Making signup API request');

      const formData = new FormData();
      formData.append('name', credentials.name);
      formData.append('surname', credentials.surname);
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);
      formData.append('password_confirm', credentials.password_confirm); // 👈 Şifre onayı
      formData.append('user_type', credentials.userType); // 👈 Eksikse hata olabilir

      if (credentials.userType === 'lawyer') {
        if (credentials.baro_sicil_no)
          formData.append('baro_sicil_no', credentials.baro_sicil_no);
        if (credentials.idCardPhoto)
          formData.append('id_card_photo', credentials.idCardPhoto); // 👈 'photo' yerine bu
      }
      
      const endpoint = credentials.userType === 'lawyer'
        ? '/auth/signup'
        : '/person/signup';

      // 🧪 Debug: FormData içeriği
      console.log('🧪 Giden form verisi:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const { data } = await axios.post<AuthResponse>(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Signup API response received ✅');
      return data;
    } catch (error) {
      console.error('Signup API error:', error);
      throw handleApiError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      console.log('🚪 Making logout API request');
      await axios.post('/auth/logout');
      console.log('Logout API response received ✅');

      // 🔓 Token'ı sil
      localStorage.removeItem('access_token');
      console.log('🔓 access_token removed from localStorage');
    } catch (error) {
      console.error('Logout API error:', error);
      throw handleApiError(error);
    }
  },

  async verifyToken(): Promise<boolean> {
    try {
      console.log('🔍 Verifying token...');

      const response = await axios.get('/auth/verify');
      console.log('Token verification successful ✅');
      console.log('Server response:', response.data);

      // Eğer sunucu "doğrulama başarılı" bilgisi dönüyorsa kontrol et:
      if (response.status === 200) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token verification failed ❌:', error);
      return false;
    }
  },
};
