export interface UserProfile {
  name: string;
  surname: string;
  email: string;
  userType: 'lawyer' | 'user';
  baro_sicil_no?: string;
}