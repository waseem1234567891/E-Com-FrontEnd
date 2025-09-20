// services/CartService.js
import api from "./api";

const GUEST_CART_KEY = "guestCart";

class CartService {
  // 🛒 Get cart
  static async getCart(token) {
    if (!token) {
      // Guest mode
      return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
    }

    // Logged-in mode
    const res = await api.get("", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  // ➕ Add to cart
  static async addToCart(productId, userId, quantity = 1, token) {
    if (!token) {
      // Guest mode
      const current = JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
      const existing = current.find((i) => i.productId === productId);

      if (existing) {
        existing.quantity += quantity;
      } else {
        current.push({ productId, quantity, productName: "Product", productPrice: 0 });
      }

      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(current));
      return current;
    }

    // Logged-in mode
    const res = await api.post(
      "/add",
      { productId, userId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  }

  // ❌ Remove item
  static async removeFromCart(productId, token) {
    if (!token) {
      // Guest mode
      const current = JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
      const updated = current.filter((i) => i.productId !== productId);
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
      return updated;
    }

    // Logged-in mode
    const res = await api.delete(`/removeItem/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  // 🧹 Clear cart
  static async clearCart(token) {
    if (!token) {
      // Guest mode
      localStorage.removeItem(GUEST_CART_KEY);
      return [];
    }

    // Logged-in mode
    const res = await api.delete("/clear", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
}

export default CartService;
