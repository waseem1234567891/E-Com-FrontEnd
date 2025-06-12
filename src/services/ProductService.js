// src/services/productService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8989/api/auth/products"; // Adjust if using a proxy or different base URL

const addProduct = (formData) => {
  return axios.post(`${API_BASE_URL}/addproduct`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};



const deleteProduct=(productId)=>{
  return axios.delete(`${API_BASE_URL}/delete/${productId}`);
}

const getProductsPaginated=(page, size, categoryId = null)=> {
  let url = `${API_BASE_URL}/paginated?page=${page}&size=${size}`;
  if (categoryId) {
    url += `&categoryId=${categoryId}`;
  }
  return axios.get(url);
};


const ProductService = {
  addProduct,
  getProductsPaginated,
  deleteProduct
};

export default ProductService;
