// src/pages/UpdateVehicle.tsx
import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { vehicleApi } from "../api/vehicleApi";

const vehicleTypes = [
  { value: 1, label: "Two Wheeler" },
  { value: 2, label: "Three Wheeler" },
  { value: 3, label: "Four Wheeler" },
];

/**
 * Validation rule:
 * - Starts with a letter
 * - Contains letters and/or digits
 * - Ends with 1 to 4 digits
 * Examples valid: MH05DU6253, MH05DU1, A1
 */
const VEHICLE_NUMBER_REGEX = /^[A-Z][A-Z0-9]*[0-9]{1,4}$/;

const UpdateVehicle: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleNumberError, setVehicleNumberError] = useState<string | null>(null);

  const [vehicleType, setVehicleType] = useState<number | "">("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleDescription, setVehicleDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchVehicle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchVehicle = async () => {
    if (!id) {
      setError("Missing vehicle id");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiRes = await vehicleApi.getById(id);
      // If API returns { success, data }, extract data
      const data = apiRes && typeof apiRes === "object" && "data" in apiRes ? apiRes.data : apiRes;
      setVehicleNumber((data.vehicle_number || "").toString().toUpperCase());
      // vehicle_type is an object with id and name
      if (data.vehicle_type && typeof data.vehicle_type === "object" && "id" in data.vehicle_type) {
        setVehicleType(data.vehicle_type.id);
      } else if (typeof data.vehicle_type === "number") {
        setVehicleType(data.vehicle_type);
      } else {
        setVehicleType("");
      }
      setVehicleModel(data.vehicle_model || "");
      setVehicleDescription(data.vehicle_description || "");
      // validate initial vehicle number
      const vErr = validateVehicleNumber((data.vehicle_number || "").toString().toUpperCase());
      setVehicleNumberError(vErr);
    } catch (err: any) {
      console.error("Fetch vehicle error:", err);
      setError(err?.message || "Failed to fetch vehicle");
    } finally {
      setLoading(false);
    }
  };

  const validateVehicleNumber = (value: string) => {
    const v = value?.trim().toUpperCase() ?? "";
    if (!v) return "Vehicle Number is required";
    if (!VEHICLE_NUMBER_REGEX.test(v)) {
      return "Invalid format — must start with a letter and end with 1–4 digits (e.g. MH05DU6253)";
    }
    return null;
  };

  const handleVehicleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const upper = e.target.value.toUpperCase();
    setVehicleNumber(upper);
    setVehicleNumberError(validateVehicleNumber(upper));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // final validations
    const vNumErr = validateVehicleNumber(vehicleNumber);
    setVehicleNumberError(vNumErr);
    if (vNumErr) {
      setError("Please fix validation errors before saving.");
      return;
    }
    if (vehicleType === "" || !vehicleModel.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    if (!id) {
      setError("Missing vehicle id");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        vehicle_number: vehicleNumber, // already uppercased and validated
        vehicle_type: Number(vehicleType),
        vehicle_model: vehicleModel,
        vehicle_description: vehicleDescription,
      };

      const res = await vehicleApi.update(id, payload);
      const msg = res?.message || res?.detail || "Vehicle updated successfully!";
      setNotification({ type: "success", message: msg });

      setTimeout(() => {
        setNotification(null);
        navigate("/vehicles");
      }, 1200);
    } catch (err: any) {
      console.error("Update vehicle error:", err);
      const msg = err?.response?.data?.detail || err?.response?.data?.vehicle_number || err?.message || "Failed to update vehicle";
      setError(String(msg));
      setNotification({ type: "error", message: String(msg) });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading || saving) {
    return (
      <main
        style={{
          flex: 1,
          padding: "48px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spinner />
          <p style={{ marginTop: 16, color: "#6c757d", fontSize: 14 }}>
            {loading ? "Loading vehicle..." : "Updating vehicle..."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        flex: 1,
        padding: "32px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Notification Popup */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 2000,
            minWidth: 260,
            background: notification.type === "success" ? "#38a169" : "#e53e3e",
            color: "#fff",
            padding: "16px 28px 16px 20px",
            borderRadius: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            fontSize: 15,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "fadeIn 0.3s",
          }}
        >
          {notification.type === "success" ? <span style={{ fontSize: 20 }}>✔️</span> : <span style={{ fontSize: 20 }}>❌</span>}
          <span>{notification.message}</span>
        </div>
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: 480,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1a202c", margin: "0 0 8px 0" }}>Update Vehicle</h2>
          <p style={{ fontSize: 13, color: "#718096", margin: 0 }}>Edit vehicle details</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Vehicle Number */}
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#2d3748" }}>
              Vehicle Number{" "}
              <span style={{ color: "red" }} title="Mandatory">*</span>
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={handleVehicleNumberChange}
              required
              placeholder="e.g. MH05DU6253"
              maxLength={16}
              style={{
            width: "100%",
            padding: "12px 14px",
            border: vehicleNumberError ? "2px solid #e53e3e" : "2px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
            transition: "border-color 0.15s",
            boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = vehicleNumberError ? "#e53e3e" : "#667eea")}
              onBlur={(e) => (e.currentTarget.style.borderColor = vehicleNumberError ? "#e53e3e" : "#e2e8f0")}
              aria-invalid={!!vehicleNumberError}
            />
            {vehicleNumberError && <div style={{ marginTop: 8, color: "#e53e3e", fontSize: 13 }}>{vehicleNumberError}</div>}
          </div>

          {/* Vehicle Type */}
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#2d3748" }}>
              Vehicle Type{" "}
              <span style={{ color: "red" }} title="Mandatory">*</span>
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(Number(e.target.value))}
              required
              style={{
            width: "100%",
            padding: "12px 14px",
            border: "2px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
            transition: "border-color 0.15s",
            boxSizing: "border-box",
            cursor: "pointer",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            >
              <option value="">Select type</option>
            {vehicleTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
            </select>
          </div>

          {/* Vehicle Model */}
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#2d3748" }}>
              Vehicle Model{" "}
              <span style={{ color: "red" }} title="Mandatory">*</span>
            </label>
            <input
              type="text"
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              required
              placeholder="Enter vehicle model"
              maxLength={32}
              style={{
            width: "100%",
            padding: "12px 14px",
            border: "2px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
            transition: "border-color 0.15s",
            boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            />
          </div>

          {/* Vehicle Description */}
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: "#2d3748" }}>
              Vehicle Description
              {/* Not mandatory */}
            </label>
            <input
              type="text"
              value={vehicleDescription}
              onChange={(e) => setVehicleDescription(e.target.value)}
              placeholder="Enter description (optional)"
              maxLength={128}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "2px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.15s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            />
          </div>

          {/* Error message */}
          {error && (
            <div style={{ color: "#c53030", background: "#fff5f5", padding: "12px 16px", borderRadius: 8, fontSize: 14, border: "1px solid #feb2b2" }}>
              {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => navigate("/vehicles")}
              style={{
            flex: 1,
            padding: 12,
            background: "#fff",
            color: "#4a5568",
            border: "2px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !!vehicleNumberError}
              style={{
            flex: 1,
            padding: 12,
            background: saving || !!vehicleNumberError ? "#cbd5e0" : "#667eea",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: saving || !!vehicleNumberError ? "not-allowed" : "pointer",
            opacity: saving ? 0.8 : 1,
              }}
            >
              {saving ? "Updating..." : "Update Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

// spinner keyframes injection (only once)
const styleId = "updatevehicle-spinner-style";
if (!document.getElementById(styleId)) {
  const styleEl = document.createElement("style");
  styleEl.id = styleId;
  styleEl.textContent = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  `;
  document.head.appendChild(styleEl);
}

export default UpdateVehicle;
