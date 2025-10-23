// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/-AuthContext"; // ✅ fixed path (removed leading '-')
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AdminUIProvider } from "./context/AdminUIContext";
import { UserProvider } from "./context/UserUIContext";
import { LocalNotificationProvider } from "./context/LocalNotificationContext";

import Navbar from "./components/Navbar";
import NotificationToasts from "./pages/NotificationToasts";

import Home from "./pages/Home";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import AdminLogin from "./components/Auth/AdminLogin";
import ForgetUsernameAndPassword from "./pages/ForgetUsernameAndPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/userdashboard/DashBoard";
import AdminDashBoard from "./pages/AdminDashBoard";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import NotificationCenterPage from "./pages/NotificationCenter";
import OrderDetails from "./pages/OrderDetails";
import ProductReviews from "./pages/adminComponent/product/ProductReviews";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDetail from "./pages/adminComponent/UserDetail";
import OrderDetailForAdmin from "./pages/adminComponent/OrderDetailForUser";
import OrderDetailForUser from "./components/OrderDetailForUser";
import ProductDetail from "./pages/ProductDetail";
import ProductDetailForAdmin from "./pages/adminComponent/ProductDetailForAdmin";
import ProductStockHistory from "./pages/adminComponent/product/ProductStockHistory";

const App = () => {
  return (
    <LocalNotificationProvider>
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
                <Route path="/product/:id" element={<ProductDetail />} /> 
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
                      <UserProvider>
                        <Dashboard />
                      </UserProvider>
                      
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
                {/* Admin Product stock history */}
                <Route
                  path="/admin-dashboard/product-stock-history/:productId"
                  element={
                    <ProtectedRoute redirectTo="/admin-login">
                      <AdminUIProvider>
                        <ProductStockHistory />
                      </AdminUIProvider>
                    </ProtectedRoute>
                  }
                />

                  {/* Admin Product details */}
                <Route
                  path="/admin-dashboard/product-detail-for-admin/:productId"
                  element={
                    <ProtectedRoute redirectTo="/admin-login">
                      <AdminUIProvider>
                        <ProductDetailForAdmin/>
                      </AdminUIProvider>
                    </ProtectedRoute>
                  }
                />
                    <Route
                  path="/admin-dashboard/user-detail/:userId"
                  element={
                    <ProtectedRoute redirectTo="/admin-login">
                      <AdminUIProvider>
                        <UserDetail />
                      </AdminUIProvider>
                    </ProtectedRoute>
                  }
                />

                {/* ✅ Order Details (wrapped in AdminUIProvider now) */}
                <Route
                  path="/order-for-admin/:orderId"
                  element={
                    <ProtectedRoute redirectTo="/login">
                      <AdminUIProvider>
                        <OrderDetailForAdmin />
                      </AdminUIProvider>
                    </ProtectedRoute>
                  }
                />

                   <Route
                  path="/order-for-user/:orderId"
                  element={
                    <ProtectedRoute redirectTo="/login">
                      <UserProvider>
                        <OrderDetailForUser />
                      </UserProvider>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </NotificationProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
    </LocalNotificationProvider>
  );
};

export default App;
