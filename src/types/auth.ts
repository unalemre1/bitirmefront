export interface LoginCredentials {
  email: string;
  password: string;
}

export interface BaseSignupCredentials {
  name: string;
  surname: string;
  email: string;
  password: string;
  password_confirm: string;
  userType: 'lawyer' | 'user';
}

export interface LawyerSignupCredentials extends BaseSignupCredentials {
  userType: 'lawyer';
  baro_sicil_no: string;
  idCardPhoto: File;
}

export interface UserSignupCredentials extends BaseSignupCredentials {
  userType: 'user';
}

export type SignupCredentials = LawyerSignupCredentials | UserSignupCredentials;

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
    userType: 'lawyer' | 'user';
    baro_sicil_no?: string;
    idCardPhotoUrl?: string;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}