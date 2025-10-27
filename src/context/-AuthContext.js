// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId,setUserId]=useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // "USER" or "ADMIN"
  // 🧩 Notifications fetched from backend after login
  const [notifications, setNotifications] = useState([]);

  const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now(); // ✅ Compare expiration to current time]
  } catch (err) {
    return true; // If something fails → treat token as invalid
  }
};

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedToken = localStorage.getItem('token');
    const storedUserId=localStorage.getItem('userId');
    const storedRole = localStorage.getItem("role");
     if(storedToken && !isTokenExpired(storedToken))
     {
       setUsername(storedUsername);
       setToken(storedToken);
       setUserId(storedUserId);
       setRole(storedRole);
       fetchNotifications(storedUsername, storedToken);
     }else{
      // ✅ Token invalid → keep user as guest
       localStorage.removeItem("username");
       localStorage.removeItem("token");
       localStorage.removeItem("userId");
       localStorage.removeItem("role");

       setUsername(null);
       setToken(null);
       setUserId(null);
       setRole(null);
     }
    

    setLoading(false);
  }, []);

  // 🧩 Helper: Fetch notifications from backend
  const fetchNotifications = async (username, token) => {
    try {
      const res = await fetch(`http://localhost:8989/notifications/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      // Sort newest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(data);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    }
  };

  const login =async (username,userId, token,userRole) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('userId',userId);
    localStorage.setItem("role", userRole);
    setUsername(username);
    setToken(token);
    setUserId(userId);
    setRole(userRole);
    // 🔔 Fetch notifications right after login
    await fetchNotifications(username, token);
  };

  
  

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem("role");
    setUsername(null);
    setToken(null);
    setUserId(null);
    setRole(null);
  };

  

  // ✅ Loading screen during auth state initialization
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ username,userId, role, token, login, logout,notifications,setNotifications }}>
      {children}
    </AuthContext.Provider>
  );
};
