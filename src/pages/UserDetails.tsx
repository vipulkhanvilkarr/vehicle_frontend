// src/pages/UserDetails.tsx
import React, { useEffect, useState } from "react";
import { userApi } from "../api/userApi";
import { authApi } from "../api/api";
import { useNavigate } from "react-router-dom";

const UserDetails: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userApi.currentUserDetails();
        setUser(data);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
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

  if (loading) return <div>Loading user details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 500, margin: "48px auto", padding: 24, background: "#fff", borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Current User Details</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default UserDetails;
