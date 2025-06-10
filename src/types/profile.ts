// src/types/profile.ts

export type UserType = 'user' | 'lawyer';

export interface UserProfile {
  id: string;
  name: string;
  surname: string;
  email: string;
  userType: UserType;
  baro_sicil_no?: string;
}

export interface UserProfileWithPassword extends UserProfile {
  oldPassword?: string;
  newPassword?: string;
}