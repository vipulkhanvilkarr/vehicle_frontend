  // ...existing code...
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
  /**
   * Delete a vehicle: DELETE /vehicles/:id/delete/
   */
  delete: async (id: string | number) => {
    const resp = await axiosInstance.delete(`/vehicles/${id}/delete/`);
    return resp.data;
  },

  /**
   * Create a vehicle: POST /vehicles/create/
   */
  create: async (payload: {
    vehicle_number: string;
    vehicle_type: number;
    vehicle_model: string;
    vehicle_description: string;
  }) => {
    const resp = await axiosInstance.post(`/vehicles/create/`, payload);
    return resp.data;
  },
  /**
   * Get a vehicle by ID: GET /vehicles/:id/
   */
  getById: async (id: string | number) => {
    const resp = await axiosInstance.get(`/vehicles/${id}/`);
    return resp.data;
  },

  /**
   * Update a vehicle: POST /vehicles/:id/update/
   */
  update: async (
    id: string | number,
    payload: {
      vehicle_number: string;
      vehicle_type: number;
      vehicle_model: string;
      vehicle_description: string;
    }
  ) => {
    const resp = await axiosInstance.patch(`/vehicles/${id}/update/`, payload);
    return resp.data;
  },
};
