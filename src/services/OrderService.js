import axios from 'axios';

const API_URL = "http://localhost:8989/orders";

// Checkout order
const checkout = async (payload, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;  // add only if token exists

  return axios.post(`${API_URL}/addorder`, payload, { headers });
};

// Update order
const updateOrderStatus = async (id, status, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  return axios.put(`${API_URL}/updateorderstatus/${id}`, { status }, { headers });
};

// Get all orders
const getAllOrders = async (token) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  return axios.get(`${API_URL}/getallorders`, { headers });
};

const OrderService = { checkout, getAllOrders, updateOrderStatus };
export default OrderService;
