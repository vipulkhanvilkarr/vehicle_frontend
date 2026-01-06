// src/pages/Login.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { login, getCurrentUser, selectAuth } from "../features/auth/authSlice";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// Color scheme matching Figma design
const colors = {
  primary: '#D4E157',
  primaryDark: '#C6D63B',
  background: '#F5F5F5',
  cardBg: '#FFFFFF',
  text: '#1E1E1E',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#E8E8E8',
  inputBorder: '#DEDEDE',
  error: '#E74C3C',
};

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAppSelector(selectAuth);

  const from = (location.state as any)?.from?.pathname;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    console.log("Login:", auth);
    if (auth.accessToken && auth.user) {
      let redirectTo = "/dashboard";
      if (from && from !== "/dashboard") redirectTo = from;
      console.log("[Login] Authenticated, redirecting to:", redirectTo);
      navigate(redirectTo, { replace: true });
    } else if (auth.accessToken && !auth.user) {
      console.log("Token present but no user");
      dispatch(getCurrentUser());
    }
  }, [auth.accessToken, auth.user, navigate, from, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Login] Submitting login for:", username);
    dispatch(login({ username, password }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1000px',
        background: colors.cardBg,
        borderRadius: '24px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        animation: 'fadeIn 0.5s ease-out',
      }}>
        {/* Left Panel - Branding */}
        <div style={{
          flex: 1,
          background: `linear-gradient(135deg, ${colors.primary} 0%, #A5D610 100%)`,
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '500px',
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '48px',
            animation: 'slideIn 0.5s ease-out 0.2s backwards',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.text }}></div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.text }}></div>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.text }}></div>
            </div>
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: colors.text,
              letterSpacing: '-0.5px',
            }}>
              AutoGarage
            </span>
          </div>

          {/* Welcome text */}
          <div style={{ animation: 'slideIn 0.5s ease-out 0.3s backwards' }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: colors.text,
              margin: '0 0 16px 0',
              lineHeight: '1.2',
            }}>
              Welcome to your<br />Garage Dashboard
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'rgba(30, 30, 30, 0.7)',
              margin: 0,
              lineHeight: '1.6',
            }}>
              Manage your vehicles, track repairs, and grow your business with our comprehensive garage management system.
            </p>
          </div>

          {/* Feature highlights */}
          <div style={{
            marginTop: '48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'slideIn 0.5s ease-out 0.4s backwards',
          }}>
            {[
              { icon: '🚗', text: 'Vehicle Management' },
              { icon: '🔧', text: 'Repair Tracking' },
              { icon: '📊', text: 'Analytics Dashboard' },
            ].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                color: colors.text,
                fontWeight: '500',
              }}>
                <span style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  {feature.icon}
                </span>
                {feature.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div style={{
          flex: 1,
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ maxWidth: '360px', margin: '0 auto', width: '100%' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: colors.text,
              marginBottom: '8px',
            }}>
              Sign In
            </h2>
            
            <p style={{
              color: colors.textSecondary,
              marginBottom: '32px',
              fontSize: '15px',
            }}>
              Enter your credentials to access your account
            </p>

            <form onSubmit={handleSubmit} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '24px' 
            }}>
              {/* Username Input */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: colors.text,
                  fontSize: '14px'
                }}>
                  Username
                </label>
                <div style={{ 
                  position: 'relative', 
                  width: '100%',
                }}>
                  <FaUser style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: focusedField === 'username' ? colors.primary : colors.textLight,
                    fontSize: '16px',
                    pointerEvents: 'none',
                    transition: 'color 0.2s ease',
                  }} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                    style={{
                      width: '100%',
                      padding: '14px 16px 14px 48px',
                      border: `2px solid ${focusedField === 'username' ? colors.primary : colors.inputBorder}`,
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      background: colors.cardBg,
                    }}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: colors.text,
                  fontSize: '14px'
                }}>
                  Password
                </label>
                <div style={{ 
                  position: 'relative', 
                  width: '100%',
                }}>
                  <FaLock style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: focusedField === 'password' ? colors.primary : colors.textLight,
                    fontSize: '16px',
                    pointerEvents: 'none',
                    transition: 'color 0.2s ease',
                  }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '14px 48px 14px 48px',
                      border: `2px solid ${focusedField === 'password' ? colors.primary : colors.inputBorder}`,
                      borderRadius: '12px',
                      fontSize: '15px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      background: colors.cardBg,
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: colors.textLight,
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.textLight}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.textSecondary,
                    fontSize: '13px',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.primaryDark}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
                >
                  Forgot password?
                </button>
              </div>

              {/* Error Message */}
              {auth.error && (
                <div style={{
                  color: colors.error,
                  background: '#FDF2F2',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  border: `1px solid #FECACA`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
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
                  padding: '16px',
                  background: auth.loading ? colors.border : colors.primary,
                  color: colors.text,
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: auth.loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: auth.loading ? 'none' : `0 4px 12px ${colors.primary}60`,
                  opacity: auth.loading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!auth.loading) {
                    e.currentTarget.style.background = colors.primaryDark;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 6px 20px ${colors.primary}80`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!auth.loading) {
                    e.currentTarget.style.background = colors.primary;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary}60`;
                  }
                }}
              >
                {auth.loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Footer */}
            <p style={{
              marginTop: '32px',
              textAlign: 'center',
              fontSize: '14px',
              color: colors.textSecondary,
            }}>
              Don't have an account?{' '}
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.primaryDark,
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Contact Admin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;