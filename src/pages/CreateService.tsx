import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vehicleApi } from "../api/vehicleApi";
import { serviceApi } from "../api/serviceApi";
import { userApi } from "../api/userApi";

interface Vehicle {
  id: number;
  vehicle_number: string;
  customer_id?: number;
  customer_name?: string;
  customer?: {
    name: string;
  };
  vehicle_model?: string;
}

const CreateService: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [intervalType, setIntervalType] = useState<string>("6"); // "3", "6", "12", "custom"
  const [customNextDate, setCustomNextDate] = useState("");
  const [intervalMonths, setIntervalMonths] = useState<number>(6);
  const [notes, setNotes] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetchingVehicles, setFetchingVehicles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setFetchingVehicles(true);
      const data = await vehicleApi.getAll();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load vehicles", err);
      setError("Failed to load vehicles. Please try again.");
    } finally {
      setFetchingVehicles(false);
    }
  };

  const handleVehicleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) {
      setSelectedVehicle(null);
      return;
    }

    // Find in the current list as backup for customer_id
    const fromList = vehicles.find(v => v.id === Number(id));

    try {
      setLoading(true);
      setError(null);
      const resp = await vehicleApi.getById(id);
      console.log("DEBUG: Vehicle Details Response:", resp);
      
      const vehicleData = resp.data || resp;
      
      // Merge customer information if missing in detail but present in list
      const merged = {
        ...fromList,
        ...vehicleData
      };

      // NEW: Fetch customer name explicitly if it's missing or "Not found"
      const cId = merged.customer_id || merged.customer?.id || (merged as any).data?.customer_id;
      if (cId) {
        try {
          const nameResp = await userApi.getCustomerName(cId);
          console.log("DEBUG: Customer Name Response:", nameResp);
          // Assuming resp format is { success: true, name: "..." } or similar
          merged.customer_name = nameResp.name || nameResp.customer_name || merged.customer_name;
        } catch (nameErr) {
          console.error("Failed to fetch customer name detail", nameErr);
        }
      }
      
      setSelectedVehicle(merged);
    } catch (err: any) {
      console.error("Failed to fetch vehicle details", err);
      setError(`Failed to load vehicle details: ${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonths = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
    
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    return months <= 0 ? 0 : months;
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setIntervalType(val);
    if (val !== "custom") {
      setIntervalMonths(Number(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) {
      setError("Please select a vehicle");
      return;
    }

    let finalInterval = intervalMonths;
    if (intervalType === "custom") {
      if (!customNextDate) {
        setError("Please select a custom next service date");
        return;
      }
      finalInterval = calculateMonths(serviceDate, customNextDate);
      if (finalInterval <= 0) {
        setError("Next service date must be at least 1 month after service date");
        return;
      }
    }
    const effectiveCustomerId = 
          selectedVehicle.customer_id || 
          (selectedVehicle as any).customer?.id || 
          (typeof selectedVehicle.customer === 'number' ? selectedVehicle.customer : 0) ||
          (selectedVehicle as any).data?.customer_id || 
          0;

    if (!effectiveCustomerId || effectiveCustomerId === 0) {
      setError("Unable to determine Customer ID for this vehicle. Please ensure the vehicle is correctly linked to a customer.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNotification(null);

    try {
      const payload = {
        vehicle_id: selectedVehicle.id,
        customer_id: effectiveCustomerId,
        service_date: serviceDate,
        service_interval_months: finalInterval,
        notes: notes,
      };
      
      const res = await serviceApi.create(payload);
      setNotification({ type: "success", message: res?.message || "Service record created successfully!" });
      
      setTimeout(() => {
        setNotification(null);
        navigate("/services");
      }, 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to create service record";
      setError(msg);
      setNotification({ type: "error", message: String(msg) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "32px", background: "#f8f9fa", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      {notification && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 2000,
          background: notification.type === "success" ? "#38a169" : "#e53e3e",
          color: "#fff", padding: "16px 24px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}>
          {notification.message}
        </div>
      )}

      <div style={{ background: "#fff", padding: "32px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", width: "100%", maxWidth: "500px" }}>
        <h2 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "600" }}>Create Service Record</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Select Vehicle *</label>
            <select 
              onChange={handleVehicleChange} 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              disabled={fetchingVehicles}
            >
              <option value="">-- Select Vehicle Number --</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.vehicle_number}</option>
              ))}
            </select>
          </div>

          {selectedVehicle && (
            <div style={{ padding: "16px", background: "#f1f5f9", borderRadius: "8px", fontSize: "14px", border: "1px solid #cbd5e0" }}>
              <p style={{ margin: "0 0 8px 0" }}>
                <strong>Customer:</strong> {
                  selectedVehicle.customer_name || 
                  selectedVehicle.customer?.name || 
                  (selectedVehicle as any).data?.customer_name || 
                  "Not found"
                }
              </p>
              <p style={{ margin: 0 }}>
                <strong>Model:</strong> {
                  selectedVehicle.vehicle_model || 
                  (selectedVehicle as any).data?.vehicle_model || 
                  "N/A"
                }
              </p>
            </div>
          )}

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Service Date *</label>
            <input 
              type="date" 
              value={serviceDate} 
              onChange={e => setServiceDate(e.target.value)} 
              required 
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Service Interval *</label>
            <select 
                value={intervalType}
                onChange={handleIntervalChange}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: intervalType === "custom" ? "12px" : "0" }}
            >
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="custom">Custom Date</option>
            </select>

            {intervalType === "custom" && (
                <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#666" }}>Next Service Date *</label>
                    <input 
                    type="date" 
                    value={customNextDate} 
                    onChange={e => setCustomNextDate(e.target.value)} 
                    required 
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    />
                </div>
            )}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Notes</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              rows={3}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              placeholder="e.g. Oil change, brake check"
            />
          </div>

          {error && <p style={{ color: "#e53e3e", fontSize: "14px" }}>{error}</p>}

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button 
              type="button" 
              onClick={() => navigate("/services")} 
              style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#667eea", color: "#fff", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating..." : "Create Record"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateService;
