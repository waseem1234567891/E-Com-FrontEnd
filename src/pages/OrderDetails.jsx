import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../services/OrderService";
import { AuthContext } from "../context/-AuthContext"; // ✅ removed leading dash
import { useAdminUI } from "../context/AdminUIContext";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { token, role } = useContext(AuthContext);
  const { setActiveMenu } = useAdminUI();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await OrderService.getOrderByOrderId(orderId, token);
        console.log("Fetched order:", res.data);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        // fallback
        if (role === "ADMIN") {
          setActiveMenu("orders");
          navigate("/admin-dashboard/orders", { replace: true });
        } else navigate("/dashboard", { replace: true });
      }
    };
    if (token) fetchOrder();
  }, [orderId, token, navigate, role, setActiveMenu]);

  const handleBack = () => {
    if (role === "ADMIN") {
      setActiveMenu("orders");
      navigate("/admin-dashboard/orders");
    } else {
      navigate("/dashboard");
    }
  };

  if (!order) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 md:p-10 bg-gradient-to-tr from-gray-100 to-white min-h-screen">
      <button
        onClick={handleBack}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Orders
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Order Details
      </h1>

      {/* ✅ Order Info */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 space-y-2">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Customer:</strong> {order.userName}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2)}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(order.orderDate).toLocaleString()}
        </p>
      </div>

      {/* ✅ Order Items */}
      {order.items && order.items.length > 0 ? (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Ordered Items
          </h2>
          <ul className="divide-y divide-gray-200">
            {order.items.map((item) => (
              <li key={item.productId} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl.startsWith("http") ? item.imageUrl : `http://localhost:8989${item.imageUrl}`}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-xl shadow"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ${item.productPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  ${(item.productPrice * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 mt-6">No items found for this order.</p>
      )}
    </div>
  );
};

export default OrderDetails;
