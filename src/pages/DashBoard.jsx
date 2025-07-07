import React, { useEffect, useState } from 'react';
import DashboardService from '../services/DashboardService';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const navigate=useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DashboardService.getDashboardData();
        setMessage(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          setMessage("Unauthorized – Please log in.");
        } else {
          setMessage("Error fetching dashboard data.");
          navigate('/login'); // Redirect to login
        }
      }
    };

    fetchData();
  }, []);

   const handleLogout = () => {
    AuthService.logout();
    navigate('/login'); // Redirect to login
  };

  return (
    <div>
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>{message}</p>
    </div>
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
    </div>
  );

  
};

export default Dashboard;
