import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";

interface User {
  id: number;
  username: string;
}

const CreateGarage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    garage_name: "",
    mobile: "",
    address: "",
    user_id: "",
    whatsapp_number: ""
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setFetchingUsers(true);
      const data = await userApi.getAllUsers();
      // Adjust based on typical API response structure
      const userList = Array.isArray(data) ? data : (data.results || data.data || []);
      setUsers(userList);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Failed to load users for dropdown.");
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotification(null);

    try {
      const payload = {
        ...formData,
        user_id: Number(formData.user_id)
      };
      const res = await userApi.createGarage(payload);
      setNotification({ type: "success", message: res?.message || "Garage created successfully!" });
      setTimeout(() => {
        setNotification(null);
        navigate("/dashboard"); // Or wherever appropriate
      }, 2000);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to create garage";
      setError(String(msg));
      setNotification({ type: "error", message: String(msg) });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <h2 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "600" }}>Create Garage</h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Garage Name *</label>
            <input 
              type="text" 
              name="garage_name"
              value={formData.garage_name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Shree Auto Garage"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Mobile Number *</label>
            <input 
              type="text" 
              name="mobile"
              value={formData.mobile} 
              onChange={handleChange} 
              required 
              placeholder="e.g. 9876543210"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>WhatsApp Number *</label>
            <input 
              type="text" 
              name="whatsapp_number"
              value={formData.whatsapp_number} 
              onChange={handleChange} 
              required 
              placeholder="e.g. 9876543210"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Address *</label>
            <textarea 
              name="address"
              value={formData.address} 
              onChange={handleChange} 
              required 
              rows={3}
              placeholder="e.g. Andheri East, Mumbai"
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Assign to User *</label>
            <select 
              name="user_id"
              value={formData.user_id} 
              onChange={handleChange} 
              required 
              disabled={fetchingUsers}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", boxSizing: "border-box" }}
            >
              <option value="">-- Select User --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          </div>

          {error && <p style={{ color: "#e53e3e", fontSize: "14px" }}>{error}</p>}

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#667eea", color: "#fff", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating..." : "Create Garage"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateGarage;
