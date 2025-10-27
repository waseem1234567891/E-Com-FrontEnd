import React, { createContext, useContext, useState } from "react";

const LocalNotificationContext = createContext();

export const LocalNotificationProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const showNotification = (msg, type = "info", duration = 3000) => {
    setType(type);
    setMessage(msg);
    setTimeout(() => setMessage(""), duration);
  };

  return (
    <LocalNotificationContext.Provider value={{ message, type, showNotification }}>
      {children}

      {/* ✅ Render toast when a message exists */}
      {message && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-md text-white text-sm font-semibold transition-all duration-300 z-[9999]
            ${
              type === "success"
                ? "bg-green-500"
                : type === "error"
                ? "bg-red-500"
                : type === "warning"
                ? "bg-yellow-400 text-black"
                : "bg-blue-500"
            }`}
        >
          {message}
        </div>
      )}
    </LocalNotificationContext.Provider>
  );
};

export const useLocalNotification = () => useContext(LocalNotificationContext);
