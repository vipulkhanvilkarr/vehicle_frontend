// src/api/api.ts
import axios, { type InternalAxiosRequestConfig } from "axios";
import type { LoginResponse } from "../features/auth/types";

// Allow `.env` to contain just the host (e.g. http://127.0.0.1:8000 or https://example.com).
// We normalize the host (trim trailing slashes) and append `/api` so the `.env` value
// can be just the host without path fragments.
const RAW_BASE = (import.meta.env.VITE_API_BASE as string) ?? "http://127.0.0.1:8000";
const API_BASE = RAW_BASE.replace(/\/+$/g, "") + "/api";

const storage = {
  getToken: () => localStorage.getItem("access_token"),
  setToken: (token: string | null) => {
    if (token) localStorage.setItem("access_token", token);
    else localStorage.removeItem("access_token");
  },
  clear: () => {
    localStorage.removeItem("access_token");
  },
};

export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach token to requests automatically.
 * NOTE: default uses Django TokenAuth header "Token <token>".
 * If your backend expects "Bearer <token>", change below to `Bearer ${t}`.
 */
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const t = storage.getToken();
  if (t) {
    // Axios v1+ guarantees headers is always defined and is a plain object
    config.headers["Authorization"] = `Bearer ${t}`;
  }
  return config;
});

// Handle expired/invalid tokens globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Token expired or invalid - clear tokens and redirect to login
      console.warn("API: Received 401 - clearing tokens and redirecting to login");
      try {
        clearToken();
        // Mark session expired so login page can show a friendly message
        localStorage.setItem("session_expired", "1");
      } catch (e) {
        // ignore
      }
      // Redirect to login page (full reload ensures redux state resets)
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
          window.location.href = "/login?expired=1";
        } else {
          // already on login - reload to clear any stale state
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  }
);


/** Auth API */
export const authApi = {
  /**
   * login: POST /auth/login/ with { username, password }
   * Expect response { success, message, data: { tokens: { access_token, refresh_token } } }
   */
  login: async (payload: { username: string; password: string }): Promise<LoginResponse> => {
    // Use axios directly without interceptor to avoid sending old/invalid Authorization header
    const resp = await axios.post(`${API_BASE}/auth/login/`, payload, {
      headers: { "Content-Type": "application/json" }
    });
    return resp.data;
  },

  /**
   * logout: POST /auth/logout/
   */
  logout: async (): Promise<boolean> => {
    // Only clear token on frontend, no backend API call
    clearToken();
    return true;
  },

  /**
   * Optional: get current user (if your backend exposes such endpoint)
   * Example path: GET /auth/user/
   */
  me: async (): Promise<any> => {
    const t = storage.getToken();
    if (!t) {
      throw new Error("No access token found. Cannot fetch user details.");
    }
    const resp = await axiosInstance.get(`/auth/current-user-details/`);
    return resp.data;
  },
};

/** Helpers exported for use by auth slice */

export const setToken = (token: string | null): void => {
  storage.setToken(token);
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const clearToken = (): void => {
  storage.clear();
  delete axiosInstance.defaults.headers.common["Authorization"];
};
