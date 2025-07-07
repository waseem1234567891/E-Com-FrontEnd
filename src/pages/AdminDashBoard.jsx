import React, { useEffect, useState } from 'react';
import DashboardService from '../services/DashboardService';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import UserManagement from './adminComponent/UserManagement';
import ProductManagement from './adminComponent/ProductManagement';
import OrderManagement from './adminComponent/OrderManagement';
import './adminComponent/AdminDashBoard.css'; // <-- import CSS

const AdminDashBoard = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DashboardService.getAdminDashboardData();
        
        setMessage(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          setMessage("Unauthorized – Please log in.");
          navigate('/admin-login');
        } else {
          setMessage("Error fetching dashboard data.");
          navigate('/admin-login');
        }
      }
    };

    fetchData();
  }, []);

  

  return (
    <div className="admin-container" style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      
      <p>{message}</p>

      <div className="admin-tabs" style={{ marginTop: '2rem' }}>
        <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button onClick={() => setActiveTab('users')}>User Management</button>
        <button onClick={() => setActiveTab('products')}>Product Management</button>
        <button onClick={() => setActiveTab('orders')}>Order Management</button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        {activeTab === 'dashboard' && <p>Welcome to the admin dashboard!</p>}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'orders' && <OrderManagement />}
      </div>
    </div>
  );
};

export default AdminDashBoard;


