// src/pages/AdminDashBoard.jsx
import React, { useEffect, useState, useContext } from 'react';
import DashboardService from '../services/DashboardService';
import { useNavigate } from 'react-router-dom';
import UserManagement from './adminComponent/UserManagement';
import ProductManagement from './adminComponent/ProductManagement';
import OrderManagement from './adminComponent/OrderManagement';
import SalesReports from '../components/SalesReports';
import UserActivityOverview from '../pages/adminComponent/UserActivityOverview';
import InventoryOverview from '../pages/adminComponent/InventoryOverview'; // ✅ NEW
import './adminComponent/AdminDashBoard.css';
import { AuthContext } from '../context/-AuthContext';
import { useAdminUI } from '../context/AdminUIContext';

const AdminDashBoard = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { activeMenu, setActiveMenu } = useAdminUI(); // context-driven tab

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DashboardService.getAdminDashboardData(token);
        setMessage(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          setMessage('Unauthorized – Please log in.');
        } else {
          setMessage('Error fetching dashboard data.');
        }
        navigate('/admin-login', { replace: true });
      }
    };
    if (token) fetchData();
  }, [token, navigate]);

  return (
    <div className="admin-container bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center py-6">Admin Dashboard</h1>
      <p className="text-center text-gray-600 mb-6">{message}</p>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 border-b pb-2">
        {[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'users', label: 'User Management' },
          { key: 'products', label: 'Product Management' },
          { key: 'orders', label: 'Order Management' },
          { key: 'sales', label: 'Sales Reports' },
          { key: 'activity', label: 'User Activity' },
          { key: 'inventory', label: 'Inventory Management' }, // ✅ New Tab
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveMenu(tab.key)}
            className={`px-4 py-2 rounded-t-lg font-semibold ${
              activeMenu === tab.key
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white text-gray-700 border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="admin-content p-4 md:p-6 bg-white rounded shadow-md mx-4 md:mx-10">
        {activeMenu === 'dashboard' && (
          <div className="text-center text-gray-600">
            <p>Welcome to the Admin Dashboard! Use the tabs above to manage the system.</p>
          </div>
        )}
        {activeMenu === 'users' && <UserManagement />}
        {activeMenu === 'products' && <ProductManagement />}
        {activeMenu === 'orders' && <OrderManagement />}
        {activeMenu === 'sales' && <SalesReports />}
        {activeMenu === 'activity' && <UserActivityOverview />}
        {activeMenu === 'inventory' && <InventoryOverview />} {/* ✅ New component */}
      </div>
    </div>
  );
};

export default AdminDashBoard;
