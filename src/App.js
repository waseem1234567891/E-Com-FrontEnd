// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import AddProduct from './pages/AddProduct';
import { ProductProvider } from "./context/ProductContext";
import {CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <ProductProvider>
      <CartProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addProduct" element={<AddProduct />} />
      </Routes>
    </Router>
    </CartProvider>
    </ProductProvider>
  );
};

export default App;
