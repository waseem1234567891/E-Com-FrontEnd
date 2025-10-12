// src/components/RoleProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/-AuthContext";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Redirect to proper dashboard
    return <Navigate to={role === "ADMIN" ? "/admin-dashboard" : "/dashboard"} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
