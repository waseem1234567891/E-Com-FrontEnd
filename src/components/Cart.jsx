// src/components/Cart.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { AuthContext } from "../context/-AuthContext";
import CartService from "../services/CartService";
import {
  getGuestCart,
  clearGuestCart,
  changeGuestCartQuantity,
  removeFromGuestCart
} from "../util/guestCart";

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
  const handleDeleteItem = async (productId) => {
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
  const handleClearCart = async () => {
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
            {cartItems.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name || item.productName}
                  className="w-12 h-12 rounded object-cover mr-3"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {item.name || item.productName}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDecrease(item.productId)}
                        className="px-2 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span className="text-xs">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrease(item.productId)}
                        className="px-2 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Price: ${item.productPrice?.toFixed(2) || "0.00"}
                  </div>
                  {item.stock !== undefined && (
                    <div className="text-xs text-gray-400 mt-1">
                      Stock: {item.stock}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteItem(item.productId)}
                  className="text-red-500 hover:text-red-700 ml-2 text-lg"
                  title="Remove item"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <div className="text-right font-semibold text-lg mb-4">
            Total: ${totalPrice.toFixed(2)}
          </div>

          <div className="flex justify-between space-x-2">
            <button
              onClick={handleClearCart}
              className="flex-1 bg-red-100 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-200 text-sm"
            >
              Clear
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 bg-green-100 text-green-700 font-semibold py-2 rounded-lg hover:bg-green-200 text-sm"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
