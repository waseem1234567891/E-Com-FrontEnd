import axios from "axios";

const API_URL = "http://localhost:8989/review";

// Fetch all reviews for a product
const getReviewsByProductId = (productId) => {
  return axios.get(`${API_URL}/product/${productId}`);
};

// Create a new review
const createReview = (payload) => {
  return axios.post(`${API_URL}`, payload);
};

// Delete a review by ID
const deleteReview = (reviewId) => {
  return axios.delete(`${API_URL}/${reviewId}`);
};

// Admin reply to a review
const replyToAReview = (reviewId, reply) => {
  // Make sure payload matches backend DTO { reply: "text" }
  return axios.put(`${API_URL}/${reviewId}/reply`, { reply });
};

export default {
  createReview,
  deleteReview,
  replyToAReview,
  getReviewsByProductId,
};
