// src/pages/Login.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { login, getCurrentUser, selectAuth } from "../features/auth/authSlice";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAppSelector(selectAuth);

  const from = (location.state as any)?.from?.pathname;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log("[Login] auth state:", auth);
    if (auth.token && auth.user) {
      let redirectTo = "/dashboard";
      if (from && from !== "/dashboard") redirectTo = from;
      console.log("[Login] Authenticated, redirecting to:", redirectTo);
      navigate(redirectTo, { replace: true });
    } else if (auth.token && !auth.user) {
      console.log("[Login] Token present but no user, fetching user...");
      dispatch(getCurrentUser());
    }
  }, [auth.token, auth.user, navigate, from, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Login] Submitting login for:", username);
    dispatch(login({ username, password }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#fff',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '8px',
          color: '#1a202c'
        }}>Login</h2>
        
        <p style={{
          textAlign: 'center',
          color: '#718096',
          marginBottom: '32px',
          fontSize: '14px'
        }}>Welcome back! Please login to your account</p>

        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px' 
        }}>
          {/* Username Input */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#2d3748',
              fontSize: '14px'
            }}>
              Username / Email
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <FaUser style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#a0aec0',
                fontSize: '16px',
                pointerEvents: 'none'
              }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
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
          </div>

          {/* Password Input */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#2d3748',
              fontSize: '14px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <FaLock style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#a0aec0',
                fontSize: '16px',
                pointerEvents: 'none'
              }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
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
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#a0aec0',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#718096'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {auth.error && (
            <div style={{
              color: '#c53030',
              background: '#fff5f5',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              border: '1px solid #feb2b2'
            }}>
              {auth.error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={auth.loading}
            style={{
              width: '100%',
              padding: '14px',
              background: auth.loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: auth.loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: auth.loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)',
              opacity: auth.loading ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!auth.loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!auth.loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            {auth.loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;