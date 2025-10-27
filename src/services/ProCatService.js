import axios from "axios";

const API_BASE_URL = "http://localhost:8989/category";

// ✅ Add a new category
const addCategory = (categoryData) => {
  return axios.post(`${API_BASE_URL}/add`, categoryData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// ✅ Get all categories
const getAllCateGory = () => {
  return axios.get(`${API_BASE_URL}/getAllCate`);
};

// ✅ Get category by ID
const getCategoryById = (categoryId) => {
  return axios.get(`${API_BASE_URL}/getbyid/${categoryId}`);
};

// ✅ Update category
const updateCategory = (categoryId, updatedData) => {
  return axios.put(`${API_BASE_URL}/update/${categoryId}`, updatedData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// ✅ Delete category
const deleteCategory = (categoryId) => {
  return axios.delete(`${API_BASE_URL}/delete/${categoryId}`);
};

const ProCatService = {
  addCategory,
  getAllCateGory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};

export default ProCatService;
