import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { AuthContext } from "./-AuthContext";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { token, username, notifications: authNotifications, setNotifications: setAuthNotifications } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const clientRef = useRef(null);

  // Merge backend notifications safely
  useEffect(() => {
    if (authNotifications?.length) {
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const newOnes = authNotifications.filter(n => !existingIds.has(n.id));
        return [...newOnes, ...prev];
      });
    }
  }, [authNotifications]);

  // Add new notification (manual or via WebSocket)
  const addNotification = useCallback((message, type = "info", duration = null, link = null, idFromBackend = null) => {
    if (!message) return;

    const id = idFromBackend ?? `local-${Date.now()}-${Math.random()}`;
    const expire = duration ? Date.now() + duration : Date.now() + 2 * 24 * 60 * 60 * 1000;

    const newNotification = { id, message, type, link, expire, temporary: !!duration };

    setNotifications(prev => {
        // ✅ Prevent duplicates by id
        if (prev.some(n => n.id === newNotification.id)) return prev;
        return [newNotification, ...prev];
      });
   // setAuthNotifications(prev => [newNotification, ...prev]);

    if (duration) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setAuthNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, [setAuthNotifications]);

  // Remove notification (UI + backend)
  const removeNotification = useCallback(async (id) => {
    if (!id) return;

    setNotifications(prev => prev.filter(n => n.id !== id));
    setAuthNotifications(prev => prev.filter(n => n.id !== id));

    if (id.toString().startsWith("local-")) return; // Skip local-only

    try {
      const res = await fetch(`http://localhost:8989/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete notification");
    } catch (err) {
      console.error("❌ Error deleting notification:", err);
    }
  }, [token, setAuthNotifications]);

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

      // Private notifications
      client.subscribe("/user/queue/notifications", (msg) => {
        try {
          const payload = JSON.parse(msg.body);
          addNotification(payload.message || "New notification", payload.type || "info", null, payload.link, payload.id);
        } catch {
          addNotification(msg.body, "info");
        }
      });

      // Global notifications
      client.subscribe("/topic/notifications", (msg) => {
        try {
          const payload = JSON.parse(msg.body);
          addNotification(payload.message || "New notification", payload.type || "info", null, null, payload.id);
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
