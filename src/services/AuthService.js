// src/services/AuthService.js
import axios from 'axios';


const API_URL = "http://localhost:8989/auth";


const register = (username, password, email) => {
  return axios.post(`${API_URL}/register`, {
    username,
    password,
    email,
  });
};

const login = (username, password) => {
  return axios.post(`${API_URL}/login`, {
    username,
    password,
  });
};

const adminlogin = (username, password) => {
  return axios.post(`${API_URL}/adminlogin`, {
    username,
    password,
  });
};

//const logout = () => {
 // localStorage.removeItem("token");
//};

const getAllUsers= async (token)=>{
   //const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.get(`${API_URL}/allusers`,config);

};


export default {
  register,
  login,adminlogin,getAllUsers,
};
