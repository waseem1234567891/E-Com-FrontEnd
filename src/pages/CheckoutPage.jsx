import React, { useState, useEffect, useContext } from "react";
import CartService from "../services/CartService";
import OrderService from "../services/OrderService";
import UserService from "../services/UserService";
import { AuthContext } from "../context/-AuthContext";

const CheckoutPage = () => {
  const { token, username, userId } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    country: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    primary: false,
  });
  const [guestInfo, setGuestInfo] = useState({ name: "", email: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(true);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      const items = token
        ? await CartService.getCart(token)
        : JSON.parse(localStorage.getItem("guestCart")) || [];
      setCartItems(items);
      setLoading(false);
    };
    fetchCart();
  }, [token]);

  // Fetch saved addresses for logged-in user
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) return;
      try {
        const res = await UserService.getAddresses(userId, token);
        setSavedAddresses(res.data || []);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      }
    };
    if (userId) fetchAddresses();
  }, [userId, token]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.productPrice || item.price || 0) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    let finalAddress = "";
    let orderPayload = {};

    if (userId) {
      // Logged-in user
      if (selectedAddressId) {
        const selected = savedAddresses.find(a => a.id === parseInt(selectedAddressId));
        if (!selected) return alert("Selected address not found!");
        finalAddress = `${selected.houseNumber} ${selected.street}, ${selected.postalCode}, ${selected.country}`;
      } else {
        const isComplete = Object.values(shippingAddress).every(val => val.toString().trim() !== "");
        if (!isComplete) return alert("Please fill in all shipping address fields.");
        finalAddress = `${shippingAddress.houseNumber} ${shippingAddress.street}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;
      }

      orderPayload = {
        shippingAddress: finalAddress,
        paymentMethod,
        items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
        totalAmount: totalPrice,
      };

      try {
        await OrderService.checkout(orderPayload, token);
        alert("✅ Order placed successfully!");
        await CartService.clearCart(token);
        window.location.href = "/";
      } catch (err) {
        console.error("Order failed:", err);
        alert("❌ Failed to place order.");
      }
    } else {
      // Guest user
      const isComplete =
        guestInfo.name.trim() &&
        guestInfo.email.trim() &&
        Object.values(shippingAddress).every(val => val.toString().trim() !== "");
      if (!isComplete) return alert("Please fill in all guest info and address fields.");

      finalAddress = `${shippingAddress.houseNumber} ${shippingAddress.street}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;
      orderPayload = {
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        shippingAddress: finalAddress,
        paymentMethod,
        items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
        totalAmount: totalPrice,
      };

      try {
        await OrderService.checkout(orderPayload); // no token
        alert("✅ Guest order placed successfully!");
        localStorage.removeItem("guestCart");
        window.location.href = "/";
      } catch (err) {
        console.error("Guest order failed:", err);
        alert("❌ Failed to place order.");
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading cart...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        Checkout {userId ? `, ${username}` : ""}
      </h2>

      {!userId && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Guest Info</h3>
          <input
            type="text"
            placeholder="Your Name"
            value={guestInfo.name}
            onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })}
            className="w-full border border-gray-300 rounded p-2 mb-2"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={guestInfo.email}
            onChange={e => setGuestInfo({ ...guestInfo, email: e.target.value })}
            className="w-full border border-gray-300 rounded p-2 mb-2"
          />
        </div>
      )}

      {userId && savedAddresses.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Select a saved address:</h3>
          {savedAddresses.map(addr => (
            <label key={addr.id} className="flex items-center gap-2 mb-1">
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddressId == addr.id}
                onChange={() => setSelectedAddressId(addr.id)}
              />
              <span>{addr.houseNumber} {addr.street}, {addr.postalCode}, {addr.country}</span>
            </label>
          ))}
          <button
            onClick={() => { setShowNewAddressForm(true); setSelectedAddressId(null); }}
            className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded"
          >
            + Add New Address
          </button>
        </div>
      )}

      {(showNewAddressForm || !userId) && (
        <div className="mb-4 border-t pt-3">
          <h3 className="text-lg font-medium mb-2">Enter shipping address:</h3>
          {["houseNumber", "street", "postalCode", "country"].map(field => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={shippingAddress[field]}
              onChange={e => setShippingAddress({ ...shippingAddress, [field]: e.target.value })}
              className="w-full border border-gray-300 rounded p-2 mb-2"
            />
          ))}
        </div>
      )}

      {/* Payment Method */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="card">Credit/Debit Card</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Order Summary:</h3>
        <ul className="space-y-2">
          {cartItems.map((item, idx) => (
            <li key={idx} className="text-sm flex justify-between">
              <span>{item.name || item.productName} x {item.quantity}</span>
              <span>${((item.productPrice || item.price) * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="text-right font-bold mt-2">Total: ${totalPrice.toFixed(2)}</div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Confirm & Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;
