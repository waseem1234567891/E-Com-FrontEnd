import React, { createContext, useContext, useState } from "react";

// Create context
const AdminUIContext = createContext();

// Provider
export const AdminUIProvider = ({ children }) => {
  // Stores the currently active sub-menu
  const [activeMenu, setActiveMenu] = useState("dashboard"); // default

  return (
    <AdminUIContext.Provider value={{ activeMenu, setActiveMenu }}>
      {children}
    </AdminUIContext.Provider>
  );
};

// Custom hook to use context
export const useAdminUI = () => useContext(AdminUIContext);
