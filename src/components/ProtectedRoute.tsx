import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const location = useLocation();
  return token ? <>{children}</> : <Navigate to="/login" replace state={{ from: location }} />;
};

export default ProtectedRoute;
