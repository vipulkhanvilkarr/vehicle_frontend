// src/pages/Dashboard.tsx
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { selectAuth, getCurrentUser } from "../features/auth/authSlice";
// import { authApi } from "../api/api";

const Dashboard: React.FC = () => {
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // If token exists but user data is missing, fetch user data
    if (auth.token && !auth.user) {
      console.log("[Dashboard] Token exists but no user data, fetching user...");
      dispatch(getCurrentUser());
    }
  }, [auth.token, auth.user, dispatch]);


  if (auth.loading) {
    return (
      <main style={{
        flex: 1,
        padding: '48px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e9ecef',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: '#6c757d', fontSize: '14px' }}>Loading user data...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      flex: 1,
      padding: '32px 16px',
      background: '#f8f9fa',
      minHeight: 'auto',
      position: 'relative',
      overflow: 'hidden', // hide any scrollbars
    }}>
      {/* Hide scrollbars visually for Dashboard */}
      <style>{`
        main::-webkit-scrollbar { display: none; }
        main { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      {/* Logout Button - Top Right (hidden for all users) */}
      {/**
      <button
        onClick={handleLogout}
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          padding: '10px 24px',
          background: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
          transition: 'all 0.2s ease',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#dc2626';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#ef4444';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
        }}
      >
        Logout
      </button>
      */}

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a202c',
            margin: '0 0 8px 0'
          }}>
            Dashboard
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#718096',
            margin: 0
          }}>
            Welcome back, {auth.user?.username ?? "User"}!
          </p>
        </div>

        {/* User Info Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Profile Card */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '32px',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              👤
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 8px 0'
            }}>
              {auth.user?.username ?? "User"}
            </h3>
            <p style={{
              fontSize: '14px',
              opacity: 0.9,
              margin: 0
            }}>
              User Profile
            </p>
          </div>

          {/* Role Card */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🎭
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: '#1a202c'
            }}>
              {auth.user?.role?.replace('_', ' ') ?? "N/A"}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#718096',
              margin: 0
            }}>
              User Role
            </p>
          </div>

          {/* Status Card */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              ✅
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: '#1a202c'
            }}>
              Active
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#718096',
              margin: 0
            }}>
              Account Status
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

// Add keyframe animation for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.querySelector('style[data-spin-animation]')) {
  styleSheet.setAttribute('data-spin-animation', 'true');
  document.head.appendChild(styleSheet);
}

export default Dashboard;