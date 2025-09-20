// utils/guestCart.js
export const getGuestCart = () => {
  const cart = sessionStorage.getItem("guestCart");
  return cart ? JSON.parse(cart) : [];
};

export const saveGuestCart = (cart) => {
  sessionStorage.setItem("guestCart", JSON.stringify(cart));
};

export const clearGuestCart = () => {
  sessionStorage.removeItem("guestCart");
};
