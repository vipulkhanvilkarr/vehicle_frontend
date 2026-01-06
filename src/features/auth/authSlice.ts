// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi, setToken, clearToken } from "../../api/api";
import type { RootState } from "../../app/store";

/** Types */
export interface User {
  id?: number | string;
  username?: string;
  email?: string;
  // roles?: string[]; // optional normalized roles array
  role?: string;
  // add fields your backend returns
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null,
  user: null,
  loading: false,
  error: null,
};

/** Thunks */

/** login: posts creds, stores tokens, then optionally fetches user */
export const login = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async (creds, { dispatch, rejectWithValue }) => {
  try {
    const data = await authApi.login(creds);

    // Check if login was successful
    if (!data.success) {
      return rejectWithValue(data.message || "Login failed");
    }

    // Extract tokens from nested response
    const { access_token, refresh_token } = data.data.tokens;

    if (!access_token) {
      return rejectWithValue("No access token returned from server");
    }

    // Store both tokens
    localStorage.setItem("refresh_token", refresh_token);
    setToken(access_token);

    // optionally fetch current user (if endpoint exists)
    try {
      await dispatch(getCurrentUser()).unwrap();
    } catch {
      // ignore fetch user errors here - user stays null but token exists
    }

    return { accessToken: access_token, refreshToken: refresh_token };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
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

      // If token is invalid/expired, clear it from localStorage
      if (err?.response?.status === 401) {
        console.warn("[getCurrentUser] Token is invalid or expired, clearing tokens...");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }

      const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Failed to fetch user";
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
    setAuthState(state, action: PayloadAction<{ accessToken: string | null; refreshToken?: string | null; user?: User | null }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
      state.user = action.payload.user ?? state.user;
      if (!action.payload.accessToken) {
        state.user = null;
        state.refreshToken = null;
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
        s.accessToken = action.payload.accessToken;
        s.refreshToken = action.payload.refreshToken;
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
      .addCase(getCurrentUser.rejected, (s, action) => {
        s.loading = false;
        s.user = null;
        // If token was invalid (401), clear tokens from state as well
        // The payload will contain the error message - check for 401-related errors
        const errorMsg = (action.payload as string) || "";
        if (errorMsg.includes("not valid") || errorMsg.includes("expired") || errorMsg.includes("Invalid token")) {
          s.accessToken = null;
          s.refreshToken = null;
        }
      })

      .addCase(logout.fulfilled, (s) => {
        s.accessToken = null;
        s.refreshToken = null;
        s.user = null;
        s.loading = false;
        s.error = null;
        localStorage.removeItem("refresh_token");
      });
  },
});

export const { setAuthState } = slice.actions;
export default slice.reducer;

/** selectors */
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.accessToken);
