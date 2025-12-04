// src/api/userApi.ts
import { axiosInstance } from "./api";

export const userApi = {
  /**
   * GET /current-user-details/
   * Returns logged-in user info
   */
  currentUserDetails: async () => {
    const res = await axiosInstance.get("/current-user-details/");
    return res.data;
  },

  /**
   * GET /users/
   * Fetch all users (SUPER_ADMIN only)
   */
  getAllUsers: async () => {
    const res = await axiosInstance.get("/users/");
    return res.data;
  },

  /**
   * POST /users/create/
   * Create a user (SUPER_ADMIN only)
   */
  createUser: async (payload: { username: string; password: string; role: string }) => {
    const res = await axiosInstance.post("/users/create/", payload);
    return res.data;
  },
};
