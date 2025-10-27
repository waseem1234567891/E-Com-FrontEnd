// src/components/Cart.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/-AuthContext";
import CartService from "../../services/CartService";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import {
  getGuestCart,
  clearGuestCart,
  changeGuestCartQuantity,
  removeFromGuestCart
} from "../../util/guestCart";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { refreshCartFlag, triggerCartRefresh } = useCartContext();
  const navigate = useNavigate();
  const { token, userId } = useContext(AuthContext);

  // Load cart
  const fetchCart = async () => {
    let items = [];
    if (token) {
      try {
        items = await CartService.getCart(token);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    } else {
      items = getGuestCart();
    }

    // Normalize image URL
    const normalizedItems = items.map(item => ({
      ...item,
      imageUrl: item.imageUrl || item.imagePath
        ? (item.imageUrl?.startsWith("http") 
            ? item.imageUrl 
            : `http://localhost:8989${item.imageUrl || item.imagePath}`)
        : "/placeholder.png"
    }));

    setCartItems(normalizedItems);
  };

  useEffect(() => {
    fetchCart();
  }, [refreshCartFlag, token]);

  // Delete item
  const handleDelete = async (productId) => {
    if (token) {
      try {
        const updated = await CartService.removeFromCart(productId, token);
        triggerCartRefresh();
      } catch (err) {
        console.error(err);
      }
    } else {
      removeFromGuestCart(productId);
      triggerCartRefresh();
    }
  };

  // Clear cart
  const handleClear = async () => {
    if (token) {
      try {
        await CartService.clearCart(token);
        triggerCartRefresh();
      } catch (err) {
        console.error(err);
      }
    } else {
      clearGuestCart();
      triggerCartRefresh();
    }
  };

  // Increase quantity
  const handleIncrease = async (productId) => {
    const item = cartItems.find(i => i.productId === productId);
    if (!item) return;
    if (item.quantity >= (item.stock || 999)) {
      alert("⚠️ Cannot exceed available stock!");
      return;
    }

    if (token) {
      await CartService.addToCart(productId, userId, 1, token);
    } else {
      changeGuestCartQuantity(productId, 1);
    }
    triggerCartRefresh();
  };

  // Decrease quantity
  const handleDecrease = async (productId) => {
    const item = cartItems.find(i => i.productId === productId);
    if (!item) return;

    if (token) {
      if (item.quantity === 1) {
        await CartService.removeFromCart(productId, token);
      } else {
        await CartService.addToCart(productId, userId, -1, token);
      }
    } else {
      changeGuestCartQuantity(productId, -1);
    }
    triggerCartRefresh();
  };

  // Checkout
  const handleCheckout = () => navigate("/checkout");

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.productPrice || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="w-80 p-5 bg-white rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
        🛍️ Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-400">Your cart is empty.</div>
      ) : (
        <>
          <ul className="space-y-4 mb-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onDelete={handleDelete}
              />
            ))}
          </ul>

           <CartSummary
            totalPrice={totalPrice}
            onClear={handleClear}
            onCheckout={handleCheckout}
          />
        </>
      )}
    </div>
  );
};

export default Cart;
