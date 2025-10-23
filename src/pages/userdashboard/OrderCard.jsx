import React from "react";

const ORDER_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
const STATUS_COLOR_MAP = {
  PENDING: "bg-yellow-500",
  CONFIRMED: "bg-indigo-500",
  PROCESSING: "bg-purple-500",
  SHIPPED: "bg-blue-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
  RETURNED: "bg-pink-500",
};

const getProgress = (status) => {
  const index = ORDER_STEPS.indexOf(status);
  if (index === -1) return 0;
  if (status === "CANCELLED") return 100;
  return ((index + 1) / (ORDER_STEPS.length - 1)) * 100;
};

const OrderCard = ({ order, onCancel, onView }) => {
  const progress = getProgress(order.status);
  const colorClass = STATUS_COLOR_MAP[order.status] || "bg-gray-400";

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${colorClass}`}>
            {order.status}
          </span>
        </div>

        <div className="mb-4">
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className={`${colorClass} h-2 rounded-full transition-all duration-300 ease-in-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            {ORDER_STEPS.map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-700 space-y-1 mb-4">
          <p><span className="font-medium">Total:</span> ₹{order.totalAmount}</p>
          <p><span className="font-medium">Date:</span> {new Date(order.orderDate).toLocaleString()}</p>
          <p><span className="font-medium">Payment:</span> {order.paymentStatus} ({order.paymentMethod})</p>
          <p><span className="font-medium">Shipping:</span> {order.shippingAddress}</p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => onView(order)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            View Details
          </button>

          {order.status !== "SHIPPED" &&
           order.status !== "DELIVERED" &&
           order.status !== "CANCELLED" && (
            <button
              onClick={() => onCancel(order)}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
