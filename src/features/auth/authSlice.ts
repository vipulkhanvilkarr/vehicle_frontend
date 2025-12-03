// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi, setToken, clearToken } from "../../api/api";
import type { RootState } from "../../app/store";

/** Types */
export interface User {
  id?: number | string;
  username?: string;
  email?: string;
  roles?: string[]; // optional normalized roles array
  role?: string;
  // add fields your backend returns
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  user: null,
  loading: false,
  error: null,
};

/** Thunks */

/** login: posts creds, stores token, then optionally fetches user */
export const login = createAsyncThunk<
  { token: string },
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async (creds, { dispatch, rejectWithValue }) => {
  try {
    const data = await authApi.login(creds); // expects { token }
    const token = (data && data.token) || data; // be flexible
    if (!token) {
      return rejectWithValue("No token returned from server");
    }

    // Always use the latest token from login response
    setToken(token);

    // optionally fetch current user (if endpoint exists)
    try {
      await dispatch(getCurrentUser()).unwrap();
    } catch {
      // ignore fetch user errors here - user stays null but token exists
    }

    return { token };
  } catch (err: any) {
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      JSON.stringify(err?.response?.data) ||
      err?.message ||
      "Login failed";
    return rejectWithValue(String(msg));
  }
});

/** getCurrentUser: uses axiosInstance (with token) to fetch /auth/user/ */
export const getCurrentUser = createAsyncThunk<User | null, void, { rejectValue: string }>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("[getCurrentUser] Fetching current user...");
      const data = await authApi.me();
      console.log("[getCurrentUser] User data received:", data);
      // normalize roles if needed
      const user: User = {
        ...data,
        roles: Array.isArray((data as any).roles) ? (data as any).roles : (data as any).role ? [(data as any).role] : [],
      };
      return user;
    } catch (err: any) {
      console.error("[getCurrentUser] Error fetching user:", err);
      const msg = err?.response?.data?.detail || err?.message || "Failed to fetch user";
      return rejectWithValue(String(msg));
    }
  }
);

/** logout: clear token & user */
export const logout = createAsyncThunk("auth/logout", async () => {
  // Optionally call backend logout endpoint here
  clearToken();
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // if you ever need to set user/token manually
    setAuthState(state, action: PayloadAction<{ token: string | null; user?: User | null }>) {
      state.token = action.payload.token;
      state.user = action.payload.user ?? state.user;
      if (!action.payload.token) {
        state.user = null;
      }
    },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(login.fulfilled, (s, action) => {
        s.loading = false;
        s.token = action.payload.token;
        s.error = null;
      })
      .addCase(login.rejected, (s, action) => {
        s.loading = false;
        s.error = (action.payload as string) || action.error.message || "Login failed";
      })

      .addCase(getCurrentUser.pending, (s) => {
        s.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (s, action) => {
        s.loading = false;
        s.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (s) => {
        s.loading = false;
        s.user = null;
        // we won't necessarily set error here to avoid overwriting login errors
      })

      .addCase(logout.fulfilled, (s) => {
        s.token = null;
        s.user = null;
        s.loading = false;
        s.error = null;
      });
  },
});

export const { setAuthState } = slice.actions;
export default slice.reducer;

/** selectors */
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token);
