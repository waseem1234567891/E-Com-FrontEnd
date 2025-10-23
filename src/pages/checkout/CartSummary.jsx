import React from "react";

export default function CartSummary({ items }) {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="border-t pt-3 mt-3">
      <h3 className="text-lg font-medium mb-2">Order Summary:</h3>
      {items.map((item) => (
        <div
          key={item.productId}
          className="flex items-center justify-between border-b py-2"
        >
          <div className="flex items-center gap-3">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-md border"
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />
            <div>
              <p className="text-sm font-medium text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500">x {item.quantity}</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            ₹{(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      ))}
      <div className="text-right font-bold mt-3 text-gray-800">
        Total: ₹{total.toFixed(2)}
      </div>
    </div>
  );
}
