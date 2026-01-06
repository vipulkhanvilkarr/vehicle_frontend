// src/components/Navbar.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { logout as logoutAction } from "../features/auth/authSlice";
import { authApi } from "../api/api";

// SVG Icons matching Figma design
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const VehicleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.6-1.6-1.8L18 10l-3-5H9L6 10l-2.4 1.2C2.7 11.4 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
    <circle cx="7" cy="17" r="2"/>
    <circle cx="17" cy="17" r="2"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const BookingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);



const ServiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    <circle cx="12" cy="12" r="4"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ 
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease'
    }}
  >
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);

// Color scheme from Figma
const colors = {
  primary: '#D4E157',      // Lime green
  primaryDark: '#C6D63B',  // Darker lime for hover
  background: '#FFFFFF',
  text: '#1E1E1E',
  textSecondary: '#666666',
  border: '#E8E8E8',
  hoverBg: '#F5F5F5',
  selectedBg: '#D4E157',
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // All tabs visible for authenticated users (role handled by backend)
  const tabs = [
    { label: "Dashboard", path: "/dashboard", Icon: DashboardIcon },
    {
      label: "Vehicles",
      Icon: VehicleIcon,
      children: [
        { label: "View List", path: "/vehicles" },
        { label: "Create Vehicle", path: "/vehicles/create" },
      ],
    },

    {
      label: "Customers",
      Icon: UsersIcon,
      children: [
        { label: "Customer List", path: "/customers" },
        { label: "Add Customer", path: "/customer-create" },
      ],
    },
    {
      label: "Services",
      Icon: ServiceIcon,
      children: [
        { label: "Service List", path: "/services" },
        { label: "Create Service", path: "/services/create" },
      ],
    },
    {
      label: "Bookings",
      Icon: BookingsIcon,
      children: [
        { label: "All Bookings", path: "/bookings" },
        { label: "New Booking", path: "/bookings/create" },
      ],
    },
    {
      label: "Admin",
      Icon: UsersIcon,
      children: [
        { label: "User Management", path: "/users" },
        { label: "Create User", path: "/user-create" },
        { label: "Create Garage", path: "/garage-create" },
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

  const isParentActive = (children?: { path?: string }[]) => {
    if (!children) return false;
    return children.some((c) => c.path && location.pathname === c.path);
  };

  return (
    <aside
      style={{
        width: isCollapsed ? "72px" : "260px",
        background: colors.background,
        color: colors.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        borderRight: `1px solid ${colors.border}`,
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Logo Header */}
      <div
        style={{
          padding: isCollapsed ? "20px 12px" : "24px 20px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          gap: 12,
        }}
      >
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Logo circles like Figma */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.primary }}></div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.primary }}></div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.primary }}></div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px", color: colors.text }}>
              AutoGarage
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed((s) => !s)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: colors.hoverBg,
            border: "none",
            color: colors.text,
            width: 32,
            height: 32,
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = colors.border)}
          onMouseLeave={(e) => (e.currentTarget.style.background = colors.hoverBg)}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          padding: isCollapsed ? "16px 8px" : "16px 12px",
          overflowY: "auto",
          overflowX: "hidden",
          flex: 1,
          minHeight: 0,
        }}
      >
        <style>{`
          aside nav::-webkit-scrollbar { width: 4px; }
          aside nav::-webkit-scrollbar-track { background: transparent; }
          aside nav::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 4px; }
          aside nav::-webkit-scrollbar-thumb:hover { background: ${colors.textSecondary}; }
        `}</style>
        
        {tabs.map((tab) => {
            const Icon = tab.Icon;
            const hasChildren = !!tab.children;
            const isItemActive = hasChildren ? isParentActive(tab.children) : isActive(tab.path);
            const isOpen = openCategory === tab.label;

            return (
              <div key={tab.label}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      setOpenCategory(isOpen ? null : tab.label);
                    } else if (tab.path) {
                      navigate(tab.path);
                    }
                  }}
                  style={{
                    position: "relative",
                    width: "100%",
                    textAlign: "left",
                    padding: isCollapsed ? "12px" : "12px 14px",
                    background: isItemActive ? colors.selectedBg : "transparent",
                    border: "none",
                    borderRadius: 10,
                    color: isItemActive ? colors.text : colors.textSecondary,
                    fontWeight: isItemActive ? 600 : 500,
                    cursor: "pointer",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isCollapsed ? "center" : "space-between",
                    gap: 12,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isItemActive) {
                      e.currentTarget.style.background = colors.hoverBg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isItemActive) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                  aria-current={isItemActive ? "page" : undefined}
                  aria-label={tab.label}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Icon />
                    {!isCollapsed && <span>{tab.label}</span>}
                  </div>
                  {hasChildren && !isCollapsed && <ChevronIcon isOpen={isOpen} />}
                </button>

                {/* Sub-items */}
                {isOpen && hasChildren && !isCollapsed && (
                  <div 
                    style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: 2, 
                      paddingLeft: 20,
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                  >
                    {tab.children?.map((child) => {
                        const isChildActive = isActive(child.path);
                        return (
                          <button
                            key={child.path}
                            onClick={() => navigate(child.path!)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "10px 14px",
                              background: isChildActive ? `${colors.primary}40` : "transparent",
                              border: "none",
                              borderRadius: 8,
                              borderLeft: isChildActive ? `3px solid ${colors.primary}` : "3px solid transparent",
                              color: isChildActive ? colors.text : colors.textSecondary,
                              fontWeight: isChildActive ? 600 : 400,
                              cursor: "pointer",
                              fontSize: 13,
                              transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              if (!isChildActive) {
                                e.currentTarget.style.background = colors.hoverBg;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isChildActive) {
                                e.currentTarget.style.background = "transparent";
                              }
                            }}
                          >
                            {child.label}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}
      </nav>

      {/* Logout Button - Bottom */}
      <div
        style={{
          padding: isCollapsed ? "12px 8px" : "16px 12px",
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: isCollapsed ? "12px" : "12px 14px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            color: "#E74C3C",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: 12,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FDE8E8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
          aria-label="Logout"
        >
          <LogoutIcon />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
