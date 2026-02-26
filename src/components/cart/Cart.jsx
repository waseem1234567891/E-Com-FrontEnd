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
  removeFromGuestCart,
  addToGuestCart
} from "../../util/guestCart";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isOver, setIsOver] = useState(false); // highlight state

  const { refreshCartFlag, triggerCartRefresh } = useCartContext();
  const navigate = useNavigate();
  const { token, userId } = useContext(AuthContext);

  // 🟢 Allow drop
  const allowDrop = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleLeave = () => setIsOver(false);

  // 🟢 Handle drop
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsOver(false);

    const data = e.dataTransfer.getData("product");
    if (!data) return;

    const product = JSON.parse(data);

    try {
      if (token) {
        // check existing quantity to respect stock
        const existing = cartItems.find(i => i.productId === product.id);
        const qty = existing ? existing.quantity : 0;

        if (qty + 1 > product.stock) {
          return alert("⚠️ Cannot exceed available stock!");
        }

        await CartService.addToCart(product.id, userId, 1, token);
      } else {
        addToGuestCart(product);
      }

      triggerCartRefresh();
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

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
      await CartService.removeFromCart(productId, token);
    } else {
      removeFromGuestCart(productId);
    }
    triggerCartRefresh();
  };

  // Clear cart
  const handleClear = async () => {
    if (token) {
      await CartService.clearCart(token);
    } else {
      clearGuestCart();
    }
    triggerCartRefresh();
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

  const handleCheckout = () => navigate("/checkout");

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.productPrice || 0) * (item.quantity || 1),
    0
  );

  return (
    <div
      onDragOver={allowDrop}
      onDragLeave={handleLeave}
      onDrop={handleDrop}
      className={`w-80 p-5 rounded-2xl shadow-xl border transition
        ${isOver ? "bg-blue-50 border-blue-400" : "bg-white border-gray-200"}`}
    >
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
        🛍️ Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-400">Drop items here 👇</div>
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