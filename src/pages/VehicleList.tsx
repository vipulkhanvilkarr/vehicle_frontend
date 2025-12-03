// src/pages/VehicleList.tsx
import React, { useEffect, useState } from "react";
import { vehicleApi } from "../api/vehicleApi";
import { authApi } from "../api/api";
import { useNavigate } from "react-router-dom";

const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleApi.getAll();
        setVehicles(data);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch vehicles");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      alert("Logout failed");
    }
  };

  if (loading) return <div>Loading vehicles...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 700, margin: "48px auto", padding: 24, background: "#fff", borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Vehicle List</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {vehicles.length === 0 ? (
        <div>No vehicles found.</div>
      ) : (
        <ul>
          {vehicles.map((v, idx) => (
            <li key={v.id || idx}>{JSON.stringify(v)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VehicleList;
