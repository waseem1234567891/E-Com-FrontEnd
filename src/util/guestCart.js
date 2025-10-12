// src/utils/guestCart.js

// Get guest cart from sessionStorage
export const getGuestCart = () => {
  const cart = sessionStorage.getItem("guestCart");
  return cart ? JSON.parse(cart) : [];
};

// Save guest cart to sessionStorage
export const saveGuestCart = (cart) => {
  sessionStorage.setItem("guestCart", JSON.stringify(cart));
};

// Clear the guest cart
export const clearGuestCart = () => {
  sessionStorage.removeItem("guestCart");
};

// Add a new product to guest cart or increment if exists
export const addToGuestCart = (product) => {
  let cart = getGuestCart();
  const existing = cart.find(i => i.productId === product.id);

  if (existing) {
    if (existing.quantity >= product.stock) {
      alert("⚠️ Cannot add more than available stock!");
      return cart;
    }
    existing.quantity += 1;
  } else {
    if (product.stock < 1) {
      alert("⚠️ Product out of stock!");
      return cart;
    }
    cart.push({
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      imagePath: product.imageUrl,
      quantity: 1,
      stock: product.stock,
    });
  }

  saveGuestCart(cart);
  return cart;
};

// Change quantity of a product in guest cart (+1 or -1)
export const changeGuestCartQuantity = (productId, delta) => {
  let cart = getGuestCart();
  let updated = false;

  cart = cart.map(item => {
    if (item.productId === productId) {
      const newQty = item.quantity + delta;
      if (newQty > item.stock) {
        alert("⚠️ Cannot exceed available stock!");
        return item;
      }
      if (newQty < 1) {
        updated = true;
        return null; // remove item
      }
      updated = true;
      return { ...item, quantity: newQty };
    }
    return item;
  }).filter(Boolean);

  if (updated) saveGuestCart(cart);
  return cart;
};

// Remove a product from guest cart
export const removeFromGuestCart = (productId) => {
  let cart = getGuestCart();
  cart = cart.filter(item => item.productId !== productId);
  saveGuestCart(cart);
  return cart;
};
