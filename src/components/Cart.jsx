import React, { useEffect, useState } from "react";
import CartService from "../services/CartService";
import { useCartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { refreshCartFlag, triggerCartRefresh } = useCartContext();
  const navigate=useNavigate();

  const fetchCart = async () => {
    try {
      const items = await CartService.getCart();
      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [refreshCartFlag]);

  const handleDeleteItem = async (productId) => {
    try {
      await CartService.removeFromCart(productId);
      triggerCartRefresh();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await CartService.clearCart();
      triggerCartRefresh();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

 const handleCheckout = () => {
    navigate("/checkout");
  };


  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    // item.productPrice might be undefined; default to 0
    const price = item.productPrice || 0;
    return total + price * item.quantity;
  }, 0);

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
                  src={`http://localhost:8989${item.productImage}`}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover mr-3"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {item.name || item.productName}
                    </span>
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                      Qty: {item.quantity}
                    </span>
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

          {/* Total Price Display */}
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
