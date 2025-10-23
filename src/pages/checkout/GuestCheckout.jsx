import React, { useEffect, useState } from "react";
import { getGuestCart, clearGuestCart } from "../../util/guestCart";
import { normalizeCartItems } from "../../util/normalizeCartItems";
import OrderService from "../../services/OrderService";
import CartSummary from "./CartSummary";
import { useNavigate } from "react-router-dom";
import { useLocalNotification } from "../../context/LocalNotificationContext";

export default function GuestCheckout() {
  const [cartItems, setCartItems] = useState([]);
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "" });
  const [shippingAddress, setShippingAddress] = useState({
    houseNumber: "",
    street: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const { showNotification, message, type } = useLocalNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const cart = getGuestCart();
    setCartItems(normalizeCartItems(cart));
  }, []);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0)
      return showNotification("Your cart is empty!", "error");

    const isComplete =
      guestInfo.name.trim() &&
      guestInfo.email.trim() &&
      Object.values(shippingAddress).every((val) => val?.toString().trim());

    if (!isComplete)
      return showNotification("Please fill all fields.", "error");

    const finalAddress = `${shippingAddress.houseNumber} ${shippingAddress.street}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;

    const orderPayload = {
      guestName: guestInfo.name,
      guestEmail: guestInfo.email,
      shippingAddress: finalAddress,
      paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };

    try {
      await OrderService.checkout(orderPayload, null);
      clearGuestCart();
      showNotification("✅ Order placed successfully!", "success");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      showNotification("❌ Failed to place order!", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        Guest Checkout
      </h2>

      {message && (
        <div
          className={`p-2 mb-4 rounded text-sm ${
            type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Guest Info */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Your Name"
          value={guestInfo.name}
          onChange={(e) =>
            setGuestInfo({ ...guestInfo, name: e.target.value })
          }
          className="w-full border border-gray-300 rounded p-2 mb-2"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={guestInfo.email}
          onChange={(e) =>
            setGuestInfo({ ...guestInfo, email: e.target.value })
          }
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      {/* Shipping Address */}
      <div className="mb-4 border-t pt-3">
        <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
        {["houseNumber", "street", "postalCode", "country"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field}
            value={shippingAddress[field]}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                [field]: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded p-2 mb-2"
          />
        ))}
      </div>

      {/* Payment */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="card">Credit/Debit Card</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      {/* Order Summary */}
      <CartSummary items={cartItems} />

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition mt-4"
      >
        Confirm & Place Order
      </button>
    </div>
  );
}
