import React, { useEffect, useState, useContext } from "react";
import CartService from "../services/CartService";
import { useCartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/-AuthContext";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { refreshCartFlag, triggerCartRefresh } = useCartContext();
  const navigate = useNavigate();
  const { token, userId } = useContext(AuthContext);

  // Load cart from API or localStorage
  const fetchCart = async () => {
    try {
      const items = await CartService.getCart(token);
      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [refreshCartFlag, token]);

  // Delete item
  const handleDeleteItem = async (productId) => {
    try {
      const updated = await CartService.removeFromCart(productId, token);
      setCartItems(updated);
      triggerCartRefresh();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    try {
      await CartService.clearCart(token);
      setCartItems([]);
      triggerCartRefresh();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // Increase quantity
  const handleIncrease = async (productId) => {
    const updatedCart = cartItems.map((item) => {
      if (item.productId === productId) {
        const newQty = item.quantity + 1;
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCartItems(updatedCart);

    // Update backend if logged in
    if (token) {
      try {
        await CartService.addToCart(productId, userId, 1, token);
        triggerCartRefresh();
      } catch (error) {
        console.error("Failed to increase quantity:", error);
      }
    } else {
      // Guest mode: update localStorage
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

  // Decrease quantity
  const handleDecrease = async (productId) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.productId === productId) {
          const newQty = item.quantity - 1;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean); // remove nulls

    setCartItems(updatedCart);

    if (token) {
      try {
        if (updatedCart.find((item) => item.productId === productId)) {
          await CartService.addToCart(productId, userId, -1, token);
        } else {
          await CartService.removeFromCart(productId, token);
        }
        triggerCartRefresh();
      } catch (error) {
        console.error("Failed to decrease quantity:", error);
      }
    } else {
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

  const handleCheckout = () => navigate("/checkout");

  const totalPrice = (cartItems || []).reduce(
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
                  src={`http://localhost:8989${item.imagePath}`}
                  alt={item.name || item.productName}
                  className="w-12 h-12 rounded object-cover mr-3"
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
