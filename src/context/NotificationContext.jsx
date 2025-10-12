// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { AuthContext } from "./-AuthContext";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

const STORAGE_KEY = "app_notifications";

export const NotificationProvider = ({ children }) => {
  const { token, username } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const clientRef = useRef(null);

  // Load persisted notifications from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const now = Date.now();
    const valid = saved.filter(n => !n.expire || n.expire > now);
    setNotifications(valid);
  }, []);

  // Persist notifications whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Add notification
  const addNotification = useCallback((message, type = "info", duration = null) => {
    if (!message) return;
    const id = Date.now() + Math.random();
    const expire = duration ? Date.now() + duration : Date.now() + 2 * 24 * 60 * 60 * 1000; // 2 days default
    const newNotification = { id, message, type, expire, temporary: !!duration };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove temporary notifications
    if (duration) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // WebSocket setup
  useEffect(() => {
    if (!token || !username) return;

    if (clientRef.current) clientRef.current.deactivate();

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8989/ws"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ Connected to WebSocket");

      client.subscribe("/user/queue/notifications", msg => {
        try {
          const payload = JSON.parse(msg.body);
          addNotification(payload.message || "New notification", payload.type || "info");
        } catch {
          addNotification(msg.body, "info");
        }
      });

      client.subscribe("/topic/notifications", msg => {
        try {
          const payload = JSON.parse(msg.body);
          addNotification(payload.message || "New notification", payload.type || "info");
        } catch {
          addNotification(msg.body, "info");
        }
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) clientRef.current.deactivate();
      clientRef.current = null;
    };
  }, [token, username, addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
