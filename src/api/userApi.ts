// src/api/userApi.ts
import { axiosInstance } from "./api";

export const userApi = {
  /**
   * Get current user details: GET /current-user-details/
   */
  currentUserDetails: async () => {
    const resp = await axiosInstance.get(`/current-user-details/`);
    return resp.data;
  },
};
