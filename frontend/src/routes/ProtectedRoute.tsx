import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated); // Log para depuração

  if (!isAuthenticated) {
    console.log("Redirecionando para /login"); // Log para depuração
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;