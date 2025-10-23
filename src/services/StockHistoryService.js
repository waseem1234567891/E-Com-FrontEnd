import axios from "axios";

const API_BASE_URL = "http://localhost:8989/history"; // Adjust as needed

// Helper to attach token
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Get all stock history for a product
const getHistoryByProduct = (productId, token) => {
  return axios.get(`${API_BASE_URL}/product/${productId}`, authHeader(token));
};

// Get single history record by ID
const getHistoryById = (historyId, token) => {
  return axios.get(`${API_BASE_URL}/${historyId}`, authHeader(token));
};

// Add new stock history entry
const addStockHistory = (formData, token) => {
  return axios.post(`${API_BASE_URL}`, formData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

// Delete a stock history entry
const deleteStockHistory = (historyId, token) => {
  return axios.delete(`${API_BASE_URL}/${historyId}`, authHeader(token));
};

// Get paginated stock history (optional)
const getStockHistoryPaginated = (page, size, token, productId = null) => {
  let url = `${API_BASE_URL}/all?page=${page}&size=${size}`;
  if (productId) url += `&productId=${productId}`;
  return axios.get(url, authHeader(token));
};

const StockHistoryService = {
  getHistoryByProduct,
  getHistoryById,
  addStockHistory,
  deleteStockHistory,
  getStockHistoryPaginated,
};

export default StockHistoryService;
