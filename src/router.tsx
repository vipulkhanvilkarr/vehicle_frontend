// src/router.tsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SuperAdmin from "./pages/SuperAdmin";
import VehicleList from "./pages/VehicleList";
import UserDetails from "./pages/UserDetails";
import CreateUser from "./pages/CreateUser";
import CreateVehicle from "./pages/CreateVehicle";
import CreateCustomer from "./pages/CreateCustomer";
import CustomerList from "./pages/CustomerList";
import ServiceList from "./pages/ServiceList";
import CreateService from "./pages/CreateService";
import CreateGarage from "./pages/CreateGarage";
import UpdateVehicle from "./pages/UpdateVehicle";
// import NotAuthorized from "./pages/NotAuthorized";
import { useAppSelector } from "./hooks";
import type { RootState } from "./app/store";


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAppSelector((s: RootState) => s.auth.accessToken);
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
};


const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/vehicles/:id/edit"
        element={
          <ProtectedRoute>
            <UpdateVehicle />
          </ProtectedRoute>
        }
      />
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
          <ProtectedRoute>
            <VehicleList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/create"
        element={
          <ProtectedRoute>
            <CreateVehicle />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer-create"
        element={
          <ProtectedRoute>
            <CreateCustomer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomerList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <ServiceList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services/create"
        element={
          <ProtectedRoute>
            <CreateService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-create"
        element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/garage-create"
        element={
          <ProtectedRoute>
            <CreateGarage />
          </ProtectedRoute>
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
