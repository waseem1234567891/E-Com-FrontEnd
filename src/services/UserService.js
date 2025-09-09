import axios from "axios";

const API_URL = "http://localhost:8989/address";

const getAddresses = (userId, token) => {
  return axios.get(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const addAddress = (address, token) => {
  return axios.post(`${API_URL}`, address, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update an existing address
const updateAddress = (addressId, address, token) => {
  return axios.put(`${API_URL}/${addressId}`, address, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteAddress = (userId, addressId, token) => {
  return axios.delete(`${API_URL}/${userId}/address/${addressId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



export default {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};