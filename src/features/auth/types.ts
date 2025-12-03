export interface User {
  id?: number | string;
  username: string;
  email?: string;
  // add other fields your backend returns
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
