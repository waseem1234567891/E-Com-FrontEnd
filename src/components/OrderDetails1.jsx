import React from "react";

const OrderDetails1 = ({ order, showItems = true, onBack }) => {
  if (!order) return null;

  return (
    <div className="p-6 md:p-10 bg-gradient-to-tr from-gray-100 to-white min-h-screen">
      {onBack && (
        <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">
          ← Back
        </button>
      )}

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Details</h1>

      {/* Order Info */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 space-y-2">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Customer:</strong> {order.userName}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2)}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
      </div>

      {/* Order Items */}
      {showItems && order.items?.length > 0 ? (
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ordered Items</h2>
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
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.productPrice?.toFixed(2)}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  ${(item.productPrice * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default OrderDetails1;
