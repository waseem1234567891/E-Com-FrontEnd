// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId,setUserId]=useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedToken = localStorage.getItem('token');
    const storedUserId=localStorage.getItem('userId');

    if (storedUsername) setUsername(storedUsername);
    if (storedToken) setToken(storedToken);
    if (storedUserId) setUserId(storedUserId);

    setLoading(false);
  }, []);

  const login = (username,userId, token) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('userId',userId)
    setUsername(username);
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUsername(null);
    setToken(null);
    setUserId(null);
  };

  // ✅ Loading screen during auth state initialization
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ username,userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
