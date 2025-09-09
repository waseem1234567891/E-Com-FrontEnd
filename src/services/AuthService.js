// src/services/AuthService.js
import axios from 'axios';


const API_URL = "http://localhost:8989/auth";


const register = (firstName,lastName,username, password, email) => {
  return axios.post(`${API_URL}/register`, {
    firstName,
    lastName,
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

const deleteUser= async (token,userId)=>{
   //const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.delete(`${API_URL}/user/${userId}`,config);

};
const updateUser= async (token,editUser)=>{
   //const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.patch(`${API_URL}/user/${editUser.id}`, editUser, config);

};

const updateProfile=(userId, payload, token)=>{
    return axios.put(`${API_URL}/updateprofile/${userId}`,payload,{
      headers: { Authorization: `Bearer ${token}` },
    });
};




export default {
  register,
  login,
  adminlogin,
  getAllUsers,
  deleteUser,
  updateUser,
  updateProfile
};
