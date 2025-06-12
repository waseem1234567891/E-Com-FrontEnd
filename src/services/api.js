// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8989/api/cart',
  withCredentials: true,
});

export default api;
