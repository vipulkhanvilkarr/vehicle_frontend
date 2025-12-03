// src/api/api.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000/api";

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
axiosInstance.interceptors.request.use((config) => {
  const t = storage.getToken();
  if (t && config.headers) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

/** Auth API */
export const authApi = {
  /**
   * login: POST /auth/login/ with { username, password }
   * Expect response { token: "..." }
   */
  login: async (payload: { username: string; password: string }) => {
    const resp = await axios.post(`${API_BASE}/auth/login/`, payload);
    return resp.data; // { token: "..." }
  },

  /**
   * logout: POST /auth/logout/
   */
  logout: async () => {
    const resp = await axiosInstance.post(`/auth/logout/`);
    return resp.data;
  },

  /**
   * Optional: get current user (if your backend exposes such endpoint)
   * Example path: GET /auth/user/
   */
  me: async () => {
    const resp = await axiosInstance.get(`/current-user-details/`);
    return resp.data;
  },
};

/** Helpers exported for use by auth slice */

export const setToken = (token: string | null) => {
  storage.setToken(token);
  if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

export const clearToken = () => {
  storage.clear();
  delete axiosInstance.defaults.headers.common["Authorization"];
};
