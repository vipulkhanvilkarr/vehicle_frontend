import { axiosInstance } from "./api";

export interface ServiceRecordPayload {
    vehicle_id: number;
    customer_id: number;
    service_date: string;
    service_interval_months: number;
    notes: string;
}

export const serviceApi = {
    /**
     * Create a service record: POST /services/create/
     */
    create: async (payload: ServiceRecordPayload) => {
        const resp = await axiosInstance.post(`/services/create/`, payload);
        return resp.data;
    },

    /**
     * Get all service records: GET /services/list
     */
    getAll: async () => {
        const resp = await axiosInstance.get(`/services/list`);
        return resp.data;
    },
};
