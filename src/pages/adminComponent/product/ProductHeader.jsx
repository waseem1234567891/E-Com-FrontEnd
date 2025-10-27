import React from "react";

const ProductHeader = ({ onAddProduct, onAddCategory,onEditCategory }) => (
  <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
    <button
      style={{ ...buttonStyle, backgroundColor: "#007bff" }}
      onClick={onAddProduct}
    >
      Add New Product
    </button>
    <button
      style={{ ...buttonStyle, backgroundColor: "#17a2b8" }}
      onClick={onAddCategory}
    >
      Add New Category
    </button>
    <button
      style={{ ...buttonStyle, backgroundColor: "#ffc107", color: "#000" }}
      onClick={onEditCategory}
    >
      Edit Categories
    </button>
  </div>
);

const buttonStyle = {
  padding: "0.5rem 1rem",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default ProductHeader;
