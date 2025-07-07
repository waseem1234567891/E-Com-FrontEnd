import axios from 'axios';

const API_URL = 'http://localhost:8989/auth';

const getDashboardData = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.get(`${API_URL}/dashboard`, config);

  
};
const getAdminDashboardData = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.get(`${API_URL}/admindashboard`, config);

  
};
const DashboardService={getDashboardData,getAdminDashboardData}

export default DashboardService;