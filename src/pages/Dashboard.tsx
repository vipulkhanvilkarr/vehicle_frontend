// src/pages/Dashboard.tsx
import React from "react";
import { useAppSelector } from "../hooks";
import { selectAuth } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/api";
import { useRoleAccess } from "../utils/roleAccess";


const Dashboard: React.FC = () => {
  const auth = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const { isSuperAdmin, isAdmin, isUser } = useRoleAccess();

  const handleLogout = async () => {
    try {
      console.log("[Dashboard] Logout button clicked. Token:", localStorage.getItem("access_token"));
      const res = await authApi.logout();
      console.log("[Dashboard] Logout API response:", res);
      if (res && (res.detail || res.success || res.status === "success")) {
        localStorage.clear();
        console.log("[Dashboard] Logout success, redirecting to /login");
        navigate("/login");
      } else {
        alert("Logout failed: " + (res?.message || "Unknown error"));
      }
    } catch (err: any) {
      console.error("[Dashboard] Logout error:", err);
      alert("Logout failed: " + (err?.message || "Unknown error"));
    }
  };

  // Dynamic tabs based on role
  const tabs = [
    { label: "Dashboard", path: "/dashboard", show: true },
    { label: "Vehicles", path: "/vehicles", show: isSuperAdmin || isAdmin || isUser },
    { label: "User Details", path: "/user-details", show: isSuperAdmin },
    { label: "Super Admin", path: "/super-admin", show: isSuperAdmin },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "48px auto", padding: 32, background: "#f9f9f9", borderRadius: 12, boxShadow: "0 2px 12px #0001" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: "8px 20px", borderRadius: 6, background: "#e74c3c", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>Logout</button>
      </div>
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        {tabs.filter(tab => tab.show).map(tab => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              padding: "10px 24px",
              borderRadius: 6,
              border: "none",
              background: "#3498db",
              color: "#fff",
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 1px 4px #0001"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 8, padding: 24, boxShadow: "0 1px 4px #0001" }}>
        <p style={{ fontSize: 18, marginBottom: 8 }}>Welcome <b>{auth.user?.username ?? "user"}</b>!</p>
        <div style={{ color: "#888", fontSize: 14, marginBottom: 8 }}>Role: <b>{auth.user?.role}</b></div>
        <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 6, fontSize: 13 }}>{JSON.stringify(auth.user, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Dashboard;
