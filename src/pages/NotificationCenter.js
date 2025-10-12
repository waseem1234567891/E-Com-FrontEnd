// src/components/NotificationCenter.js
import React from "react";
import { useNotifications } from "../context/NotificationContext";

const NotificationCenter = () => {
  const { notifications, removeNotification } = useNotifications();

  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-6">
        <h2 className="text-lg font-bold mb-4">Notifications</h2>
        <p className="text-gray-500">No notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-6">
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.map(n => (
          <li
            key={n.id}
            className={`p-3 rounded-md border flex justify-between items-center ${
              n.type === "success"
                ? "border-green-400 bg-green-50"
                : n.type === "error"
                ? "border-red-400 bg-red-50"
                : n.type === "warning"
                ? "border-yellow-400 bg-yellow-50"
                : "border-blue-400 bg-blue-50"
            }`}
          >
            <span>{typeof n.message === "string" ? n.message : JSON.stringify(n.message)}</span>
            <button
              className="ml-4 text-gray-500 hover:text-gray-700"
              onClick={() => removeNotification(n.id)}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationCenter;
