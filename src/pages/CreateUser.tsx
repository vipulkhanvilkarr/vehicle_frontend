// src/pages/CreateUser.tsx
import React, { useState } from "react";
import { userApi } from "../api/userApi";
import { useNavigate } from "react-router-dom";

const CreateUser: React.FC = () => {
  const [form, setForm] = useState({ username: "", password: "", role: "USER" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setNotification(null);
    try {
      const res = await userApi.createUser(form);
      const msg = res?.message || res?.detail || "User created successfully!";
      setSuccess(msg);
      setNotification({ type: 'success', message: msg });
      setForm({ username: "", password: "", role: "USER" });
      setTimeout(() => {
        setNotification(null);
        navigate("/users");
      }, 2000);
    } catch (err: any) {
      let msg = "Failed to create user";
      const data = err?.response?.data;
      if (data) {
        if (typeof data === "string") {
          msg = data;
        } else if (data.detail) {
          msg = data.detail;
        } else if (data.username && Array.isArray(data.username)) {
          msg = data.username.join(" ");
        } else if (typeof data === "object") {
          // Show first error from any field
          const firstKey = Object.keys(data)[0];
          if (Array.isArray(data[firstKey])) {
            msg = data[firstKey].join(" ");
          } else {
            msg = String(data[firstKey]);
          }
        }
      } else if (err?.message) {
        msg = err.message;
      }
      setError(msg);
      setNotification({ type: 'error', message: msg });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      flex: 1,
      padding: '32px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      minHeight: 'auto',
      top: '10vh',
      position: 'relative'
    }}>
      {/* Notification Popup */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 2000,
            minWidth: 260,
            background: notification.type === 'success' ? '#38a169' : '#e53e3e',
            color: '#fff',
            padding: '16px 28px 16px 20px',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            fontSize: 15,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            animation: 'fadeIn 0.3s',
          }}
        >
          {notification.type === 'success' ? (
            <span style={{ fontSize: 20, marginRight: 8 }}>✔️</span>
          ) : (
            <span style={{ fontSize: 20, marginRight: 8 }}>❌</span>
          )}
          <span>{notification.message}</span>
        </div>
      )}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '480px'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1a202c',
            margin: '0 0 8px 0'
          }}>
            Create User
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#718096',
            margin: 0
          }}>
            Add a new user to the system
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Username */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2d3748'
            }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Password */}
          <div style={{ position: "relative" }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2d3748'
            }}>
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 44px 12px 14px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "12px",
                top: "38px",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                outline: "none"
              }}
              tabIndex={0}
            >
              {showPassword ? (
                // Eye open icon (SVG)
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                // Eye closed icon (SVG)
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.07 21.07 0 0 1 5.06-7.94"/>
                  <path d="M1 1l22 22"/>
                  <path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/>
                </svg>
              )}
            </button>
          </div>

          {/* Role */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#2d3748'
            }}>
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </div>

          {/* Success Message */}
          {success && (
            <div style={{
              color: '#22543d',
              background: '#f0fff4',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              border: '1px solid #9ae6b4'
            }}>
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              color: '#c53030',
              background: '#fff5f5',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              border: '1px solid #feb2b2'
            }}>
              {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '8px'
          }}>
            <button
              type="button"
              onClick={() => navigate('/users')}
              style={{
                flex: 1,
                padding: '12px',
                background: '#fff',
                color: '#4a5568',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f7fafc';
                e.currentTarget.style.borderColor = '#cbd5e0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: loading ? '#cbd5e0' : '#667eea',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#5568d3';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateUser;