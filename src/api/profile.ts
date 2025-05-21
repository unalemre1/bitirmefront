import axios from '../config/axios';
import { handleApiError } from '../utils/errorHandler';
import type { UserProfile } from '../types/auth';

export const profileApi = {
  async fetchProfile(): Promise<UserProfile> {
    try {
      const { data } = await axios.get<UserProfile>('/profile');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data } = await axios.put<UserProfile>('/profile', profile);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};