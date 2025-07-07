// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';

import { ProductProvider } from "./context/ProductContext";
import {CartProvider } from "./context/CartContext";
import { AuthProvider } from './context/-AuthContext';
import AdminLogin from './components/Auth/AdminLogin';
import Dashboard from './pages/DashBoard';
import AdminDashBoard from './pages/AdminDashBoard';
import CheckoutPage from './pages/CheckoutPage'

const App = () => {
  return (
    <ProductProvider>
      <CartProvider>
        <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
       
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashBoard />} />
        <Route path="/checkout" element={<CheckoutPage />} />

      </Routes>
    </Router>
    </AuthProvider>
    </CartProvider>
    </ProductProvider>
  );
};

export default App;
