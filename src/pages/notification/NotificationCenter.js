// src/components/NotificationCenter.js
import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate, Link } from "react-router-dom";

const NotificationCenter = () => {
  const { notifications, removeNotification } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-6">
      {/* === Header === */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Notifications</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          &larr; Back
        </button>
      </div>

      {/* === Empty state === */}
      {!notifications || notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications yet.</p>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {notifications
            .slice() // shallow copy to avoid mutating original
            .sort((a, b) => b.id - a.id) // newest first
            .map((n) => (
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
                {/* === Message Section === */}
                <div className="flex-1">
                  {n.link ? (
                    n.link.startsWith("http") ? (
                      <a
                        href={n.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {n.message}
                      </a>
                    ) : (
                      <Link
                        to={n.link}
                        className="text-blue-600 hover:underline"
                      >
                        {n.message}
                      </Link>
                    )
                  ) : (
                    <span>{n.message}</span>
                  )}
                </div>

                {/* === Remove Button === */}
                <button
                  className="ml-4 text-gray-500 hover:text-gray-700"
                  onClick={() => removeNotification(n.id)}
                  aria-label="Remove notification"
                >
                  &times;
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationCenter;
