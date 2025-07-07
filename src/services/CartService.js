import api from "./api";

//const API_BASE_URL = "http://localhost:8989/cart";
class CartService {
  static async addToCart(productId,productName,productImage,productPrice, quantity = 1) {
    try {
      const response = await api.post('/add', { productId,productName,productImage,productPrice, quantity });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

   static async removeFromCart(productId) {
    try {
      const response = await api.delete(`/removeItem/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

   static async getCart() {
    try {
      const response = await api.get('');
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  }
  
  static async clearCart() {
    try {
      const response = await api.delete("/clear");
      return response.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }
}

export default CartService;