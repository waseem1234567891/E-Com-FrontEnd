import React, { useState, useEffect, useContext } from "react";
import CartService from "../services/CartService";
import OrderService from "../services/OrderService";
import { AuthContext } from "../context/-AuthContext";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const{token}=useContext(AuthContext);
  const [shippingAddressBefore, setShippingAddress] = useState({
    country: "",
    street: "",
    houseNumber: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    const fetchCart = async () => {
      const items = await CartService.getCart();
      setCartItems(items);
    };
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.productPrice || 0) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    const isAddressComplete = Object.values(shippingAddressBefore).every(
      (val) => val.trim() !== ""
    );
    if (!isAddressComplete) {
      alert("Please fill in all shipping address fields.");
      return;
    }

    const shippingAddress = `${shippingAddressBefore.houseNumber} ${shippingAddressBefore.street}, ${shippingAddressBefore.postalCode}, ${shippingAddressBefore.country}`;

    const payload = {
      shippingAddress,
      paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalAmount: totalPrice,
    };
    console.log("Checkout payload:", payload);

    try {
      
      await OrderService.checkout(payload,token);
      alert("✅ Order placed!");
      await CartService.clearCart();
      window.location.href = "/";
    } catch (error) {
      console.error("Order failed", error);
      alert("❌ Failed to place order.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Checkout</h2>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Country:</label>
        <input
          type="text"
          value={shippingAddressBefore.country}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddressBefore, country: e.target.value })
          }
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Street Name:</label>
        <input
          type="text"
          value={shippingAddressBefore.street}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddressBefore, street: e.target.value })
          }
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1">House Number:</label>
        <input
          type="text"
          value={shippingAddressBefore.houseNumber}
          onChange={(e) =>
            setShippingAddress({
              ...shippingAddressBefore,
              houseNumber: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Postal Code:</label>
        <input
          type="text"
          value={shippingAddressBefore.postalCode}
          onChange={(e) =>
            setShippingAddress({
              ...shippingAddressBefore,
              postalCode: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

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

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Order Summary:</h3>
        <ul className="space-y-2">
          {cartItems.map((item, idx) => (
            <li key={idx} className="text-sm flex justify-between">
              <span>
                {item.name || item.productName} x {item.quantity}
              </span>
              <span>${(item.productPrice * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="text-right font-bold mt-2">
          Total: ${totalPrice.toFixed(2)}
        </div>
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
