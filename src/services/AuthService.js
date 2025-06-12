// src/services/AuthService.js
import axios from 'axios';

const API_URL = "http://localhost:8989/api/auth";

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

export default {
  register,
  login,
};
