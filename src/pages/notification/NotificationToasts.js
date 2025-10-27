import React, { useEffect, useState } from "react";
import { useNotifications } from "../../context/NotificationContext";

const NotificationToasts = () => {
  const { notifications } = useNotifications();
  const [toasts, setToasts] = useState([]);

  // Show new notifications as toasts
  useEffect(() => {
    if (notifications.length === 0) return;

    const newToast = notifications[notifications.length - 1];
    if (newToast) {
      setToasts((prev) => [...prev, newToast]);

      // Auto-remove toast after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    }
  }, [notifications]);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium
            animate-fade-in-down transition-all duration-300
            ${getTypeClass(toast.type)}
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

// Helper to choose color by type
const getTypeClass = (type) => {
  switch (type) {
    case "success":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
    case "warning":
      return "bg-yellow-500 text-black";
    default:
      return "bg-blue-500";
  }
};

export default NotificationToasts;
