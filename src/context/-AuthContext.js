// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedToken = localStorage.getItem('token');

    if (storedUsername) setUsername(storedUsername);
    if (storedToken) setToken(storedToken);

    setLoading(false);
  }, []);

  const login = (username, token) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    setUsername(username);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setUsername(null);
    setToken(null);
  };

  // ✅ Loading screen during auth state initialization
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ username, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
