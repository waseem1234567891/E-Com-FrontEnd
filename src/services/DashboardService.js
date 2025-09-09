import axios from 'axios';

const API_URL = 'http://localhost:8989/';

const getDashboardData = async (token) => {
 // const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.get(`${API_URL}auth/dashboard`, config);

  
};
const getAdminDashboardData = async (token) => {
  //const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.get(`${API_URL}auth/admindashboard`, config);

  
};
const getUserOrders = (token,userId) => {
  
  return axios.get(`${API_URL}orders/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const DashboardService={getDashboardData,getAdminDashboardData,getUserOrders}

export default DashboardService;