// src/services/productService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8989/products"; // Adjust if using a proxy or different base URL

const addProduct = (formData) => {
  return axios.post(`${API_BASE_URL}/addproduct`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
const getProductById = (productId) => {
  return axios.get(`${API_BASE_URL}/${productId}`,  {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};


const updateProduct = (id,formData) => {
  return axios.put(`${API_BASE_URL}/edit/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};


const deleteProduct=async(productId,token)=>{
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  return axios.delete(`${API_BASE_URL}/delete/${productId}`,config);
};


const getProductsPaginated=(page, size, categoryId = null,keyword=null)=> {
  let url = `${API_BASE_URL}/allproduct?page=${page}&size=${size}`;
  if (categoryId) {
    url += `&categoryId=${categoryId}`;
  }
  if(keyword)
  {
    url +=`&keyword=${keyword}`
  }
  return axios.get(url);
};


const ProductService = {
  addProduct,
  getProductsPaginated,
  deleteProduct,
  updateProduct,
  getProductById
};

export default ProductService;
