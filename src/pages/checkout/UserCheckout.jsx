import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/-AuthContext";
import CartService from "../../services/CartService";
import OrderService from "../../services/OrderService";
import UserService from "../../services/UserService";
import { normalizeCartItems } from "../../util/normalizeCartItems";
import CartSummary from "./CartSummary";
import AddAddressForm from "../checkout/AddAddressForm";
import { useNavigate } from "react-router-dom";
import { useLocalNotification } from "../../context/LocalNotificationContext";

export default function UserCheckout() {
  const { token, username, userId } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const { showNotification, message, type } = useLocalNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cart = await CartService.getCart(token);
        setCartItems(normalizeCartItems(cart));

        const res = await UserService.getAddresses(userId, token);
        const list = res.data || [];
        setAddresses(list);

        if (list.length > 0) {
          setSelectedAddress(list[0]);
        }
      } catch (err) {
        console.error("❌ Failed fetching checkout data:", err);
      }
    };
    fetchData();
  }, [token, userId]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      return showNotification("Please select a shipping address.", "error");
    }

    const addressText = `${selectedAddress.houseNumber} ${selectedAddress.street}, ${selectedAddress.postalCode}, ${selectedAddress.country}`;

    const payload = {
      shippingAddress: addressText,
      paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
    };

    try {
      await OrderService.checkout(payload, token);
      await CartService.clearCart(token);
      //showNotification("✅ Order placed successfully!", "success");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      showNotification("❌ Failed to place order!", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        Checkout, {username}
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

      {/* 🏠 Address Section */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Shipping Address</h3>

        {addresses.length > 0 && !showNewAddressForm ? (
          <>
            {addresses.map((addr) => (
              <label key={addr.id} className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress?.id === addr.id}
                  onChange={() => setSelectedAddress(addr)}
                />
                <span>
                  {addr.houseNumber} {addr.street}, {addr.postalCode}, {addr.country}
                </span>
              </label>
            ))}

            {/* ➕ Add New Address */}
            <button
              onClick={() => setShowNewAddressForm(true)}
              className="text-blue-600 text-sm underline mt-2"
            >
              + Add New Address
            </button>
          </>
        ) : (
          <AddAddressForm
            userId={userId}
            token={token}
            onSave={(saved) => {
              const updated = [...addresses, saved];
              setAddresses(updated);
              setSelectedAddress(saved);
              setShowNewAddressForm(false);
            }}
            onCancel={() => addresses.length > 0 && setShowNewAddressForm(false)}
          />
        )}
      </div>

      {/* 💳 Payment Method */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Payment Method:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="card">Credit / Debit Card</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      {/* 🛒 Cart Summary */}
      <CartSummary items={cartItems} />

      {/* ✅ Place Order Button */}
      {addresses.length > 0 && !showNewAddressForm && (
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition mt-4"
        >
          Confirm & Place Order
        </button>
      )}
    </div>
  );
}
