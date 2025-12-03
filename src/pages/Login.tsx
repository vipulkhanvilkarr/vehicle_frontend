// src/pages/Login.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { login, getCurrentUser, selectAuth } from "../features/auth/authSlice";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAppSelector(selectAuth);

  // Where to redirect after login
  const from = (location.state as any)?.from?.pathname;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // if already logged in, redirect
  useEffect(() => {
    console.log("[Login] auth state:", auth);
    if (auth.token && auth.user) {
      let redirectTo = "/dashboard";
      // Only use 'from' if it exists and is not /dashboard
      if (from && from !== "/dashboard") redirectTo = from;
      console.log("[Login] Authenticated, redirecting to:", redirectTo);
      navigate(redirectTo, { replace: true });
    } else if (auth.token && !auth.user) {
      // token present but no user loaded yet -> fetch user
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
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 24, background: "#fff", borderRadius: 8 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Username / Email
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>

        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>

        {auth.error && <div style={{ color: "darkred" }}>{auth.error}</div>}

        <button type="submit" disabled={auth.loading}>
          {auth.loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default Login;
