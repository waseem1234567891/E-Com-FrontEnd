import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { AuthContext } from "./-AuthContext";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

const STORAGE_KEY = "app_notifications";

export const NotificationProvider = ({ children }) => {
  const {
    token,
    username,
    notifications: authNotifications,
    setNotifications: setAuthNotifications,
  } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const clientRef = useRef(null);

  // ✅ Merge backend notifications (from AuthContext) into local state
  useEffect(() => {
    if (authNotifications && authNotifications.length > 0) {
      // Avoid duplicates by comparing IDs (if backend notifications have IDs)
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const newOnes = authNotifications.filter((n) => !existingIds.has(n.id));
        return [...newOnes, ...prev];
      });
    }
  }, [authNotifications]);

  // ✅ Load persisted notifications (optional fallback)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const now = Date.now();
    const valid = saved.filter((n) => !n.expire || n.expire > now);
    setNotifications(valid);
  }, []);

  // ✅ Persist notifications in localStorage for reloads
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // ✅ Add new notification (for WebSocket or manually)
  const addNotification = useCallback((message, type = "info", duration = null, link) => {
    if (!message) return;
    const id = Date.now() + Math.random();
    const expire = duration
      ? Date.now() + duration
      : Date.now() + 2 * 24 * 60 * 60 * 1000; // 2 days default
    const newNotification = { id, message, type, expire, temporary: !!duration, link };

    setNotifications((prev) => [newNotification, ...prev]);
    setAuthNotifications((prev) => [newNotification, ...prev]); // sync with AuthContext

    // Auto-remove temporary notifications
    if (duration) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setAuthNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }
  }, [setAuthNotifications]);

  // ✅ Remove notification
  const removeNotification = useCallback(
  async (id) => {
    if (!id) return;

    try {
      // === 1. Optimistically remove from UI ===
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setAuthNotifications((prev) => prev.filter((n) => n.id !== id));

      // === 2. Call backend API ===
      const response = await fetch(`http://localhost:8989/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.status}`);
      }

      console.log(`🗑️ Notification ${id} deleted from backend`);
    } catch (error) {
      console.error("❌ Error deleting notification:", error);

      // === 3. Optionally restore notification if delete failed ===
      const deleted = notifications.find((n) => n.id === id);
      if (deleted) {
        setNotifications((prev) => [deleted, ...prev]);
        setAuthNotifications((prev) => [deleted, ...prev]);
      }
    }
  },
  [token, notifications, setAuthNotifications]
);


  // ✅ WebSocket setup (real-time updates)
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
          const message = payload.message || "New notification";
          const type = payload.type || "info";
          const link = payload.link || null;
          addNotification(message, type, null, link);
        } catch {
          addNotification(msg.body, "info");
        }
      });

      // Global notifications
      client.subscribe("/topic/notifications", (msg) => {
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
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
