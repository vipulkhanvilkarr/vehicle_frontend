// src/api/userApi.ts
import { axiosInstance } from "./api";

export const userApi = {
  /**
   * GET /current-user-details/
   * Returns logged-in user info
   */
  currentUserDetails: async () => {
    const res = await axiosInstance.get("/auth/current-user-details/");
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
   * GET /garage/customers
   */
  getGarageCustomers: async () => {
    const res = await axiosInstance.get("/garages/customers");
    return res.data;
  },

  /**
   * POST /auth/users/create/
   * Create a user (SUPER_ADMIN only)
   */
  createUser: async (payload: { username: string; email: string; password: string; role: string }) => {
    const res = await axiosInstance.post("/auth/users/create/", payload);
    return res.data;
  },

  /**
   * POST /garages/create/
   */
  createGarage: async (payload: {
    garage_name: string;
    mobile: string;
    address: string;
    user_id: number;
    whatsapp_number: string;
  }) => {
    const res = await axiosInstance.post("/garages/create/", payload);
    return res.data;
  },

  /**
   * GET /garages/customer-name/<id>/
   */
  getCustomerName: async (customerId: number | string) => {
    const res = await axiosInstance.get(`/garages/customer-name/${customerId}/`);
    return res.data;
  },

  /**
   * GET /garages/user-name/<id>/
   */
  getUserName: async (userId: number | string) => {
    const res = await axiosInstance.get(`/garages/user-name/${userId}/`);
    return res.data;
  },

  /**
   * POST /garages/customers/create/
   */
  createGarageCustomer: async (payload: { name: string; mobile: string; address: string }) => {
    const res = await axiosInstance.post("/garages/customers/create/", payload);
    return res.data;
  },
};
