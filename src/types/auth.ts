export interface LoginCredentials {
  email: string;
  password: string;
}
export interface SignupCredentials {
  email: string;
  name: string;
  surname: string;
  password: string;
  password_confirm: string;
  userType: 'user' | 'lawyer';
  baro_sicil_no?: string;
  idCardPhoto?: File;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: string;
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



export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}