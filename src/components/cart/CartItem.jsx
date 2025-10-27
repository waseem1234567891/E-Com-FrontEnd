// src/components/Cart/CartItem.jsx
import React from "react";

const CartItem = ({ item, onIncrease, onDecrease, onDelete }) => (
  <li className="flex items-center justify-between bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200">
    <img
      src={item.imageUrl}
      alt={item.name || item.productName}
      className="w-12 h-12 rounded object-cover mr-3"
      onError={(e) => (e.currentTarget.src = "/placeholder.png")}
    />
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-800 truncate">
          {item.name || item.productName}
        </span>
        <div className="flex items-center space-x-2">
          <button onClick={() => onDecrease(item.productId)} className="px-2 bg-gray-200 rounded">
            -
          </button>
          <span className="text-xs">{item.quantity}</span>
          <button onClick={() => onIncrease(item.productId)} className="px-2 bg-gray-200 rounded">
            +
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-600 mt-1">
        Price: ${item.productPrice?.toFixed(2) || "0.00"}
      </div>
      {item.stock !== undefined && (
        <div className="text-xs text-gray-400 mt-1">Stock: {item.stock}</div>
      )}
    </div>
    <button
      onClick={() => onDelete(item.productId)}
      className="text-red-500 hover:text-red-700 ml-2 text-lg"
      title="Remove item"
    >
      ❌
    </button>
  </li>
);

export default CartItem;
