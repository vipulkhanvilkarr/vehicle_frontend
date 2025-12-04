// src/components/Navbar.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRoleAccess } from "../utils/roleAccess";
import { useAppDispatch } from "../hooks";
import { logout as logoutAction } from "../features/auth/authSlice";
import { authApi } from "../api/api";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuperAdmin, isAdmin, isUser } = useRoleAccess();
  const dispatch = useAppDispatch();

  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { label: "Dashboard", path: "/dashboard", show: true, icon: "📊" },
    {
      label: "Vehicles",
      show: isSuperAdmin || isAdmin || isUser,
      icon: "🚗",
      children: [
        { label: "View List", path: "/vehicles", show: isSuperAdmin || isAdmin || isUser },
        { label: "Create Vehicle", path: "/vehicles/create", show: isSuperAdmin },
      ],
    },
    {
      label: "Users",
      show: isSuperAdmin,
      icon: "👥",
      children: [
        { label: "User List", path: "/users", show: isSuperAdmin },
        { label: "Create User", path: "/user-create", show: isSuperAdmin },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      if (authApi && typeof (authApi as any).logout === "function") {
        await (authApi as any).logout();
      }
      localStorage.clear();
      dispatch(logoutAction());
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.error("Logout failed:", err);
      alert("Logout failed: " + (err?.message || "Unknown error"));
    }
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  // Parent is active if any child path matches current location
  const isParentActive = (children?: { path?: string }[]) => {
    if (!children) return false;
    return children.some((c) => c.path && location.pathname === c.path);
  };

  // Render a single nav button (handles active indicator)
  const NavButton: React.FC<{
    children?: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    collapsed?: boolean;
    style?: React.CSSProperties;
    label?: string;
  }> = ({ children, onClick, active, collapsed, style, label }) => {
    return (
      <button
        onClick={onClick}
        style={{
          position: "relative",
          width: "100%",
          textAlign: "left",
          padding: collapsed ? "10px 8px" : "10px 12px",
          background: active ? "rgba(52,152,219,0.08)" : "transparent",
          border: "none",
          borderRadius: 8,
          color: active ? "#3498db" : "#fff",
          fontWeight: active ? 600 : 500,
          cursor: "pointer",
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          gap: 10,
          transition: "all 0.12s",
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = "transparent";
        }}
        aria-current={active ? "page" : undefined}
        aria-label={label}
      >
        {/* Active indicator line */}
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 8,
            bottom: 8,
            width: active ? 4 : 4,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            background: active ? "#3498db" : "transparent",
            transition: "background 0.12s, transform 0.12s",
            transform: collapsed ? (active ? "translateX(0)" : "translateX(-50%)") : "translateX(0)",
          }}
        />
        {/* Content shifted right a bit so indicator doesn't overlap */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 8, width: "100%" }}>{children}</div>
      </button>
    );
  };

  return (
    <aside
      style={{
        width: isCollapsed ? "80px" : "260px",
        background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        boxShadow: "2px 0 12px rgba(0, 0, 0, 0.15)",
        transition: "width 0.24s ease",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: isCollapsed ? "12px 10px" : "16px 14px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {!isCollapsed && (
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.4px", color: "#fff" }}>Vehicle System</div>
        )}

        <button
          onClick={() => setIsCollapsed((s) => !s)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "none",
            color: "#fff",
            width: 34,
            height: 34,
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            transition: "background 0.12s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        >
          {isCollapsed ? "☰" : "×"}
        </button>
      </div>

      {/* Nav (scrollable, takes remaining space) */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: isCollapsed ? "8px 6px" : "12px",
          overflowY: "auto",
          overflowX: "hidden",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Hide scrollbar visually */}
        <style>{`
          aside nav::-webkit-scrollbar { display: none; }
          aside nav { scrollbar-width: none; -ms-overflow-style: none; }
        `}</style>
        {tabs
          .filter((tab) => tab.show)
          .map((tab) =>
            tab.children ? (
              <div key={tab.label}>
                <NavButton
                  onClick={() => setOpenCategory(openCategory === tab.label ? null : tab.label)}
                  active={isParentActive(tab.children) || isActive(tab.path)}
                  collapsed={isCollapsed}
                  label={tab.label}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{tab.icon}</span>
                    {!isCollapsed && <span>{tab.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <span style={{ marginLeft: "auto", fontSize: 12, transform: openCategory === tab.label ? "rotate(180deg)" : "rotate(0deg)" }}>
                      ▼
                    </span>
                  )}
                </NavButton>

                {openCategory === tab.label && !isCollapsed && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 10, marginBottom: 6 }}>
                    {tab.children
                      .filter((child) => child.show)
                      .map((child) => (
                        <NavButton
                          key={child.path}
                          onClick={() => navigate(child.path!)}
                          active={isActive(child.path)}
                          collapsed={isCollapsed}
                          label={child.label}
                          style={{ paddingLeft: 6 }}
                        >
                          <div style={{ width: "100%", textAlign: "left" }}>{child.label}</div>
                        </NavButton>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <NavButton
                key={tab.path}
                onClick={() => navigate(tab.path!)}
                active={isActive(tab.path)}
                collapsed={isCollapsed}
                label={tab.label}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{tab.icon}</span>
                  {!isCollapsed && <span>{tab.label}</span>}
                </div>
              </NavButton>
            )
          )}
      </nav>

      {/* Logout - pinned to bottom of sidebar (always visible) */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          zIndex: 40,
          background: isCollapsed ? "transparent" : "linear-gradient(180deg, rgba(44,62,80,0.95), rgba(44,62,80,0.98))",
          padding: 8,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: isCollapsed ? "10px 8px" : "10px 12px",
            borderRadius: 8,
            border: "none",
            background: "rgba(231,76,60,0.95)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e74c3c";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(231,76,60,0.95)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          aria-label="Logout"
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
