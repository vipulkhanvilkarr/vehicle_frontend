export interface User {
  id?: number | string;
  username: string;
  email?: string;
  // add other fields your backend returns
}

// New Login API Response structure
export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    tokens: TokenPair;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}
