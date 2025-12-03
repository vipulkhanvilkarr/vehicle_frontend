// src/router.tsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SuperAdmin from "./pages/SuperAdmin";
import VehicleList from "./pages/VehicleList";
import UserDetails from "./pages/UserDetails";
// import NotAuthorized from "./pages/NotAuthorized";
import { useAppSelector } from "./hooks";
import type { RootState } from "./app/store";
import { useRoleAccess } from "./utils/roleAccess";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAppSelector((s: RootState) => s.auth.token);
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
};


const AppRouter: React.FC = () => {
  const { isSuperAdmin, isAdmin, isUser, hasRole } = useRoleAccess();

  return (
    <Routes>
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          hasRole(["SUPER_ADMIN", "ADMIN", "USER"]) ? (
            <ProtectedRoute>
              <VehicleList />
            </ProtectedRoute>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/user-details"
        element={
          isSuperAdmin ? (
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute>
            <SuperAdmin />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
