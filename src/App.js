// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/-AuthContext"; // ✅ fixed path (removed leading '-')
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AdminUIProvider } from "./context/AdminUIContext";

import Navbar from "./components/Navbar";
import NotificationToasts from "./pages/NotificationToasts";

import Home from "./pages/Home";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import AdminLogin from "./components/Auth/AdminLogin";
import ForgetUsernameAndPassword from "./pages/ForgetUsernameAndPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/DashBoard";
import AdminDashBoard from "./pages/AdminDashBoard";
import CheckoutPage from "./pages/CheckoutPage";
import NotificationCenterPage from "./pages/NotificationCenter";
import OrderDetails from "./pages/OrderDetails";
import ProductReviews from "./pages/adminComponent/ProductReviews";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <NotificationProvider>
            <Router>
              <Navbar />
              <NotificationToasts />

              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/notifications" element={<NotificationCenterPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/forget-username-password" element={<ForgetUsernameAndPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* User Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute redirectTo="/login">
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Dashboard */}
                <Route
                  path="/admin-dashboard/*"
                  element={
                    <ProtectedRoute redirectTo="/admin-login">
                      <AdminUIProvider>
                        <AdminDashBoard /> {/* All nested routes handled inside AdminDashBoard */}
                      </AdminUIProvider>
                    </ProtectedRoute>
                  }
                />

                {/* Admin Product Reviews */}
                <Route
                  path="/admin-dashboard/product-reviews/:productId"
                  element={
                    <ProtectedRoute redirectTo="/admin-login">
                      <AdminUIProvider>
                        <ProductReviews />
                      </AdminUIProvider>
                    </ProtectedRoute>
                  }
                />

                {/* ✅ Order Details (wrapped in AdminUIProvider now) */}
                <Route
                  path="/order/:orderId"
                  element={
                    <ProtectedRoute redirectTo="/login">
                      <AdminUIProvider>
                        <OrderDetails />
                      </AdminUIProvider>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </NotificationProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;
