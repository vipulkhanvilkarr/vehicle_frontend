// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { selectAuth, getCurrentUser } from "../features/auth/authSlice";

// Widget data interface
interface DashboardStats {
  totalVehicles: number;
  servicesDoneToday: number;
  upcomingServices: number;
  customersCount: number;
}

// Color scheme matching Figma
const colors = {
  primary: '#D4E157',
  primaryDark: '#C6D63B',
  background: '#F5F5F5',
  cardBg: '#FFFFFF',
  text: '#1E1E1E',
  textSecondary: '#666666',
  textLight: '#999999',
  success: '#4CAF50',
  border: '#E8E8E8',
};

// Mini sparkline component
const Sparkline: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 40;
  const width = 100;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Icon components
const VehicleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.6-1.6-1.8L18 10l-3-5H9L6 10l-2.4 1.2C2.7 11.4 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
    <circle cx="7" cy="17" r="2"/>
    <circle cx="17" cy="17" r="2"/>
  </svg>
);

const ServiceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Dashboard: React.FC = () => {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  
  // Mock data - replace with actual API calls
  const [stats] = useState<DashboardStats>({
    totalVehicles: 156,
    servicesDoneToday: 12,
    upcomingServices: 47,
    customersCount: 234
  });

  useEffect(() => {
    if (auth.accessToken && !auth.user) {
      console.log("[Dashboard] Token exists but no user data, fetching user...");
      dispatch(getCurrentUser());
    }
  }, [auth.accessToken, auth.user, dispatch]);

  if (auth.loading) {
    return (
      <main style={{
        flex: 1,
        padding: '48px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.background,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `4px solid ${colors.border}`,
            borderTop: `4px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: colors.textSecondary, fontSize: '14px' }}>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  // Widget configuration matching Figma design
  const widgets = [
    {
      id: 'vehicles',
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      Icon: VehicleIcon,
      trend: '+12.5%',
      trendLabel: 'from last month',
      sparklineData: [30, 45, 35, 50, 40, 60, 55, 70, 65, 80],
      accentColor: '#6366F1',
      bgColor: '#EEF2FF',
    },
    {
      id: 'services-today',
      title: 'Services Done Today',
      value: stats.servicesDoneToday,
      Icon: ServiceIcon,
      trend: '+8.2%',
      trendLabel: 'from yesterday',
      sparklineData: [20, 25, 22, 30, 28, 35, 32, 40, 38, 45],
      accentColor: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      id: 'upcoming',
      title: 'Upcoming Services',
      value: stats.upcomingServices,
      Icon: CalendarIcon,
      trend: '+5.3%',
      trendLabel: 'next 7 days',
      sparklineData: [40, 38, 42, 45, 43, 48, 46, 50, 47, 52],
      accentColor: '#F59E0B',
      bgColor: '#FFFBEB',
    },
    {
      id: 'customers',
      title: 'Customers Count',
      value: stats.customersCount,
      Icon: UsersIcon,
      trend: '+15.8%',
      trendLabel: 'from last month',
      sparklineData: [50, 55, 52, 60, 58, 65, 70, 75, 80, 90],
      accentColor: '#EC4899',
      bgColor: '#FDF2F8',
    }
  ];

  return (
    <main style={{
      flex: 1,
      padding: '32px',
      background: colors.background,
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflowY: 'auto',
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', animation: 'fadeIn 0.4s ease-out' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: colors.text,
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
          }}>
            Hi, {auth.user?.username ?? "Admin"} 👋
          </h1>
          <p style={{
            fontSize: '15px',
            color: colors.textSecondary,
            margin: 0,
          }}>
            Here's what's happening with your garage today.
          </p>
        </div>

        {/* Stats Widgets Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}>
          {widgets.map((widget, index) => {
            const Icon = widget.Icon;
            return (
              <div
                key={widget.id}
                style={{
                  background: colors.cardBg,
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)',
                  border: `1px solid ${colors.border}`,
                  animation: `fadeIn 0.4s ease-out ${index * 0.1}s backwards`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {/* Left side - Icon, Value, Title */}
                  <div>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: widget.bgColor,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: widget.accentColor,
                      marginBottom: '16px',
                    }}>
                      <Icon />
                    </div>
                    
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: colors.text,
                      marginBottom: '4px',
                      letterSpacing: '-1px',
                    }}>
                      {widget.value.toLocaleString()}
                    </div>
                    
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: colors.textSecondary,
                    }}>
                      {widget.title}
                    </div>
                  </div>

                  {/* Right side - Sparkline */}
                  <div style={{ marginTop: '8px' }}>
                    <Sparkline data={widget.sparklineData} color={widget.accentColor} />
                  </div>
                </div>

                {/* Trend indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: `1px solid ${colors.border}`,
                }}>
                  <span style={{
                    color: colors.success,
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="18,15 12,9 6,15"/>
                    </svg>
                    {widget.trend}
                  </span>
                  <span style={{ fontSize: '13px', color: colors.textLight }}>
                    {widget.trendLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </main>
  );
};

export default Dashboard;