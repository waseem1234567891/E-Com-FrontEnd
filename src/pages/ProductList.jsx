import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import ProCatService from "../services/ProCatService";
import { useCartContext } from "../context/CartContext";
import { AuthContext } from "../context/-AuthContext";

import {
  getGuestCart,
  addToGuestCart,
  changeGuestCartQuantity,
  removeFromGuestCart,
} from "../util/guestCart";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const { refreshCartFlag, triggerCartRefresh } = useCartContext();
  const { userId, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🧩 Fetch product categories
  const fetchProductCategory = async () => {
    try {
      const response = await ProCatService.getAllCateGory();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading product categories:", error);
    }
  };

  useEffect(() => {
    fetchProductCategory();
  }, []);

  // 🧩 Fetch paginated products
  const fetchProducts = async (
    pageNumber = 0,
    categoryId = selectedCategory,
    keyword = searchTerm
  ) => {
    try {
      const response = await ProductService.getProductsPaginated(
        pageNumber,
        6,
        categoryId === "All" || categoryId === "" ? null : categoryId,
        keyword && keyword.trim() !== "" ? keyword : null
      );
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(page, selectedCategory, searchTerm.trim() !== "" ? searchTerm : null);
  }, [page, refreshCartFlag, selectedCategory, searchTerm]);

  // 🧩 Add product to cart
  const handleAddToCart = async (product) => {
    if (!token) {
      addToGuestCart(product);
      triggerCartRefresh();
      return;
    }

    try {
      const cartItems = await CartService.getCart(token);
      const existingQty = cartItems.find(item => item.productId === product.id)?.quantity || 0;
      if (existingQty + 1 > product.stock) {
        return alert(`❌ Cannot add more than ${product.stock} items for ${product.name}`);
      }

      await CartService.addToCart(product.id, userId, 1, token);
      triggerCartRefresh();
     // alert("✅ Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart.");
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(0);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-center mb-4">
        Product List (Page {page + 1} of {totalPages})
      </h2>

      {/* 🔍 Search + Category Filter */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border px-3 py-2 rounded w-52"
        >
          <option value="All">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.proCatId} value={cat.proCatId}>
              {cat.proCatName}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      {/* 🛍️ Product Grid */}
      <div className="flex flex-wrap gap-6 justify-center">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center">No products found.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)} // ✅ navigate to detail page
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
                  e.stopPropagation(); // prevent triggering navigation
                  handleAddToCart(product);
                }}
                disabled={product.stock === 0}
                className={`${product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                  } text-white font-semibold py-2 px-4 rounded-lg shadow w-full transition`}
              >
                🛒 {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          ))
        )}
      </div>

      {/* ⏭️ Pagination */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={page + 1 === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductList;
