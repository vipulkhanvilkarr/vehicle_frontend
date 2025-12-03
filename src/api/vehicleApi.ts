// src/api/vehicleApi.ts
import { axiosInstance } from "./api";

export const vehicleApi = {
  /**
   * Get all vehicles: GET /vehicles/
   */
  getAll: async () => {
    const resp = await axiosInstance.get(`/vehicles/`);
    return resp.data;
  },
};
