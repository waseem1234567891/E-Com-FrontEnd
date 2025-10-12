import React, { useState, useEffect, useContext } from "react";
import CartService from "../services/CartService";
import OrderService from "../services/OrderService";
import UserService from "../services/UserService";
import { AuthContext } from "../context/-AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { token, username, userId } = useContext(AuthContext);
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

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

  // ✅ Fetch Cart Items
  useEffect(() => {
    const fetchCart = async () => {
      const items = token
        ? await CartService.getCart(token)
        : JSON.parse(sessionStorage.getItem("guestCart")) || [];

      const normalizedItems = items.map((item) => ({
        ...item,
        imageUrl:
          item.imageUrl || item.imagePath
            ? item.imageUrl?.startsWith("http")
              ? item.imageUrl
              : `http://localhost:8989${item.imageUrl || item.imagePath}`
            : "/placeholder.png",
      }));

      setCartItems(normalizedItems);
      setLoading(false);
    };
    fetchCart();
  }, [token]);

  // ✅ Fetch Saved Addresses for Logged-in Users
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) return;
      try {
        const res = await UserService.getAddresses(userId, token);
        setSavedAddresses(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    if (userId) fetchAddresses();
  }, [userId, token]);

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + (item.productPrice || item.price || 0) * item.quantity,
    0
  );

  // ✅ Handle Order Placement
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0)
      return addNotification("Cart is empty!", "error");

    let finalAddress = "";
    let orderPayload = {};

    // ✅ Logged-in User Checkout
    if (userId) {
      if (selectedAddressId) {
        const selected = savedAddresses.find(
          (a) => a.id === parseInt(selectedAddressId)
        );
        if (!selected)
          return addNotification("Selected address not found!", "error");

        finalAddress = `${selected.houseNumber} ${selected.street}, ${selected.postalCode}, ${selected.country}`;
      } else {
        // If user enters a new address
        const isComplete = Object.values(shippingAddress).every(
          (val) => val?.toString().trim() !== ""
        );
        if (!isComplete)
          return addNotification(
            "Please fill in all shipping address fields.",
            "error"
          );

        finalAddress = `${shippingAddress.houseNumber} ${shippingAddress.street}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;

        // ✅ Save new address if user wants or has none
        if (shippingAddress.primary || savedAddresses.length === 0) {
          try {
            const payload = { ...shippingAddress, userId };
            await UserService.addAddress(userId, payload, token);
            addNotification("✅ Address saved successfully!", "success");
          } catch (err) {
            console.error("Failed to save address:", err);
            addNotification("⚠️ Could not save address!", "error");
          }
        }
      }

      orderPayload = {
        shippingAddress: finalAddress,
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
      };
    }

    // ✅ Guest Checkout
    else {
      const isComplete =
        guestInfo.name.trim() &&
        guestInfo.email.trim() &&
        Object.values(shippingAddress).every(
          (val) => val?.toString().trim() !== ""
        );
      if (!isComplete)
        return addNotification(
          "Please fill in all guest info and address fields.",
          "error"
        );

      finalAddress = `${shippingAddress.houseNumber} ${shippingAddress.street}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;
      orderPayload = {
        guestName: guestInfo.name,
        guestEmail: guestInfo.email,
        shippingAddress: finalAddress,
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
      };
    }

    // ✅ Place Order
    try {
      const order = await OrderService.checkout(orderPayload, token);
      if (userId) await CartService.clearCart(token);
      else localStorage.removeItem("guestCart");

      addNotification(
        `✅ Order #${order.id} placed successfully!`,
        "success"
      );
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      console.error(err);
      addNotification(
        `Failed to place order: ${err.message || "Unknown error"}`,
        "error",
        5000
      );
    }
  };

  if (loading) return <div className="text-center mt-10">Loading cart...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        Checkout {userId ? `, ${username}` : ""}
      </h2>

      {/* ✅ Guest Info */}
      {!userId && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Guest Info</h3>
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
            className="w-full border border-gray-300 rounded p-2 mb-2"
          />
        </div>
      )}

      {/* ✅ Saved Addresses */}
      {userId && savedAddresses.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Select a saved address:</h3>
          {savedAddresses.map((addr) => (
            <label key={addr.id} className="flex items-center gap-2 mb-1">
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddressId == addr.id}
                onChange={() => setSelectedAddressId(addr.id)}
              />
              <span>
                {addr.houseNumber} {addr.street}, {addr.postalCode},{" "}
                {addr.country}
              </span>
            </label>
          ))}
          <button
            onClick={() => {
              setShowNewAddressForm(true);
              setSelectedAddressId(null);
            }}
            className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded"
          >
            + Add New Address
          </button>
        </div>
      )}

      {/* ✅ No Saved Addresses */}
      {userId && savedAddresses.length === 0 && (
        <div className="mb-4 border-t pt-3">
          <p className="text-gray-700 mb-2">
            You don’t have any saved addresses yet. Please enter a new one:
          </p>
        </div>
      )}

      {/* ✅ New Address Form */}
      {(showNewAddressForm ||
        !userId ||
        (userId && savedAddresses.length === 0)) && (
        <div className="mb-4 border-t pt-3">
          <h3 className="text-lg font-medium mb-2">Enter shipping address:</h3>
          {["houseNumber", "street", "postalCode", "country"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
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
          {userId && (
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={shippingAddress.primary}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    primary: e.target.checked,
                  })
                }
              />
              <span className="text-sm text-gray-600">
                Save this address for future orders
              </span>
            </label>
          )}
        </div>
      )}

      {/* ✅ Payment Method */}
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

      {/* ✅ Order Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Order Summary:</h3>
        <ul className="space-y-3">
          {cartItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between gap-3 border-b pb-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.name || item.productName}
                  className="w-12 h-12 object-cover rounded-md border"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {item.name || item.productName}
                  </p>
                  <p className="text-xs text-gray-500">x {item.quantity}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-800">
                ₹{((item.productPrice || item.price) * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="text-right font-bold mt-3 text-gray-800">
          Total: ₹{totalPrice.toFixed(2)}
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Confirm & Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;
