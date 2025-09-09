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
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(true);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      const items = await CartService.getCart();
      setCartItems(items);
    };
    fetchCart();
  }, []);

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) return;
      try {
        const res = await UserService.getAddresses(userId, token);
        setSavedAddresses(res.data || []);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [userId, token]);

  if (!userId) return <div className="text-center mt-10">Loading user info...</div>;
  if (loading) return <div className="text-center mt-10">Loading addresses...</div>;

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.productPrice || 0) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    let finalAddress;

    if (selectedAddressId) {
      const selected = savedAddresses.find(a => a.id === parseInt(selectedAddressId));
      if (!selected) {
        alert("Selected address not found!");
        return;
      }
      finalAddress = `${selected.street}, ${selected.city}, ${selected.state}, ${selected.postalCode}, ${selected.country}`;
    } else {
      // validate new address
      const isComplete = Object.values(shippingAddress).every(val => val.toString().trim() !== "");
      if (!isComplete) {
        alert("Please fill in all shipping address fields.");
        return;
      }
      finalAddress = `${shippingAddress.houseNumber} ${shippingAddress.street}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;

      // Save new address if marked
      if (shippingAddress.primary || showNewAddressForm) {
        try {
          await UserService.addAddress({ ...shippingAddress, userId }, token);
          const res = await UserService.getAddresses(userId, token);
          setSavedAddresses(res.data || []);
          setShowNewAddressForm(false);
        } catch (err) {
          console.error("Failed to save new address:", err);
        }
      }
    }

    const payload = {
      shippingAddress: finalAddress,
      paymentMethod,
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: totalPrice,
    };

    try {
      await OrderService.checkout(payload, token);
      alert("✅ Order placed successfully!");
      await CartService.clearCart();
      window.location.href = "/";
    } catch (err) {
      console.error("Order failed:", err);
      alert("❌ Failed to place order.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        Checkout, {username}
      </h2>

      {/* Existing Addresses */}
      {savedAddresses.length > 0 && (
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
              <span>{addr.street}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}</span>
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

      {/* New Address Form */}
      {showNewAddressForm && (
        <div className="mb-4 border-t pt-3">
          <h3 className="text-lg font-medium mb-2">Enter new shipping address:</h3>
          {["country", "street", "houseNumber", "postalCode"].map(field => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={shippingAddress[field]}
              onChange={e => setShippingAddress({ ...shippingAddress, [field]: e.target.value })}
              className="w-full border border-gray-300 rounded p-2 mb-2"
            />
          ))}

          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={shippingAddress.primary}
              onChange={e => setShippingAddress({ ...shippingAddress, primary: e.target.checked })}
              className="mr-2"
            />
            <label>Set as primary/preferred</label>
          </div>
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
              <span>${(item.productPrice * item.quantity).toFixed(2)}</span>
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
