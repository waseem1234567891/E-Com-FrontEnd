import React from "react";

const ProductCard = ({ product, onAddToCart, onNavigate }) => {
  return (
    <div
      draggable
      onDragStart={(e) =>
        e.dataTransfer.setData("product", JSON.stringify(product))
      }
      onClick={() => onNavigate(product.id)}
      className="border border-gray-300 rounded-xl p-4 bg-white shadow hover:shadow-md transition duration-200 w-full sm:w-[48%] md:w-[30%] cursor-pointer"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
      <p className="text-gray-600 mb-1">Price: ${product.price}</p>
      <p className="text-gray-500 mb-2">In Stock: {product.stock}</p>

      <img
        src={`http://localhost:8989${product.imageUrl}`}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-3"
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
        disabled={product.stock === 0}
        className={`${
          product.stock === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white font-semibold py-2 px-4 rounded-lg shadow w-full transition`}
      >
        🛒 {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductCard;