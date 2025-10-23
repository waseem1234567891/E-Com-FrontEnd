// ✅ Ensures all cart items have consistent shape and image URL
export const normalizeCartItems = (items = []) => {
  return items.map((item) => ({
    ...item,
    productId: item.productId || item.id,
    name: item.name || item.productName || "Unnamed Product",
    price: item.productPrice || item.price || 0,
    imageUrl:
      item.imageUrl || item.imagePath
        ? item.imageUrl?.startsWith("http")
          ? item.imageUrl
          : `http://localhost:8989${item.imageUrl || item.imagePath}`
        : "/placeholder.png",
  }));
};
