import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  
  const [refreshCartFlag, setRefreshCartFlag] = useState(false);

  const triggerCartRefresh = () => {
    setRefreshCartFlag(prev => !prev);
  };

  return (
    <CartContext.Provider value={{ refreshCartFlag, triggerCartRefresh }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
