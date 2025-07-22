import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return <Component />; // ✅ Ensure it's used as a React component.
};

export default ProtectedRoute;
