import React, { useEffect, useState } from "react";
import { serviceApi } from "../api/serviceApi";
import { useNavigate } from "react-router-dom";

interface ServiceRecord {
  id: number;
  service_type: string;
  service_date: string;
  service_interval_months: number;
  next_service_date?: string;
  notes?: string;
  reminder_status: string;
  created_at: string;
}

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const resp = await serviceApi.getAll();
      
      // Handle payload structure { success: true, data: [...] }
      if (resp && resp.success && Array.isArray(resp.data)) {
        setServices(resp.data);
      } else if (Array.isArray(resp)) {
        setServices(resp);
      } else {
        setServices([]);
      }
    } catch (err: any) {
      setError("Failed to fetch service records.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "#f6ad55";
      case "COMPLETED": return "#48bb78";
      default: return "#718096";
    }
  };

  return (
    <main style={{ padding: "32px", background: "#f8f9fa", minHeight: "100vh", flex: 1 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "600" }}>Service History</h1>
          <button 
            onClick={() => navigate("/services/create")}
            style={{ padding: "10px 20px", background: "#667eea", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
          >
            + New Service
          </button>
        </div>

        {error && <div style={{ padding: "16px", background: "#fff5f5", color: "#c53030", borderRadius: "8px", marginBottom: "20px" }}>{error}</div>}

        <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>Loading service records...</div>
          ) : services.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#718096" }}>No service records found.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f7fafc", borderBottom: "1px solid #e2e8f0" }}>
                <tr>
                  <th style={thStyle}>Service Date</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Interval</th>
                  <th style={thStyle}>Next Service</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #edf2f7" }}>
                    <td style={tdStyle}>{s.service_date}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "12px", fontWeight: "600", padding: "4px 8px", background: "#edf2f7", borderRadius: "4px" }}>
                        {s.service_type}
                      </span>
                    </td>
                    <td style={tdStyle}>{s.service_interval_months} Months</td>
                    <td style={tdStyle}>{s.next_service_date || "N/A"}</td>
                    <td style={tdStyle}>
                       <span style={{ color: getStatusColor(s.reminder_status), fontWeight: "600", fontSize: "13px" }}>
                        {s.reminder_status}
                       </span>
                    </td>
                    <td style={tdStyle}>{s.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
};

const thStyle: React.CSSProperties = { padding: "16px", textAlign: "left", fontSize: "14px", fontWeight: "600", color: "#4a5568" };
const tdStyle: React.CSSProperties = { padding: "16px", fontSize: "14px", color: "#2d3748" };

export default ServiceList;
