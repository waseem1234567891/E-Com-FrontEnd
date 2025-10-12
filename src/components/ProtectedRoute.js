// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/-AuthContext";

/**
 * ProtectedRoute ensures user/admin is logged in.
 * redirectTo: optional, default "/login"
 */
const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
