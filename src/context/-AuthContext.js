// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId,setUserId]=useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // "USER" or "ADMIN"

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedToken = localStorage.getItem('token');
    const storedUserId=localStorage.getItem('userId');
    const storedRole = localStorage.getItem("role");

    if (storedUsername) setUsername(storedUsername);
    if (storedToken) setToken(storedToken);
    if (storedUserId) setUserId(storedUserId);
    if (storedRole) setRole(storedRole);
    

    setLoading(false);
  }, []);

  const login = (username,userId, token,userRole) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('userId',userId);
    localStorage.setItem("role", userRole);
    setUsername(username);
    setToken(token);
    setUserId(userId);
    setRole(userRole);
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
    <AuthContext.Provider value={{ username,userId, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
