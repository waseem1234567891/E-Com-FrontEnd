import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import ProCatService from "../services/ProCatService";
import { useCartContext } from "../context/CartContext";
import { AuthContext } from "../context/-AuthContext";
import ProductCard from "./adminComponent/product/models/ProductCard";

import { addToGuestCart } from "../util/guestCart";

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

  const fetchProductCategory = async () => {
    try {
      const response = await ProCatService.getAllCateGory();
      setCategories(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductCategory();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getProductsPaginated(
        page,
        6,
        selectedCategory === "All" ? null : selectedCategory,
        searchTerm || null
      );

      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, refreshCartFlag, selectedCategory, searchTerm]);

  const handleAddToCart = async (product) => {
    if (!token) {
      addToGuestCart(product);
      triggerCartRefresh();
      return;
    }

    try {
      const cartItems = await CartService.getCart(token);
      const existingQty =
        cartItems.find((i) => i.productId === product.id)?.quantity || 0;

      if (existingQty + 1 > product.stock) {
        return alert(`❌ Max stock reached for ${product.name}`);
      }

      await CartService.addToCart(product.id, userId, 1, token);
      triggerCartRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      {/* Filters */}
      {/* (unchanged for now) */}

      <div className="flex flex-wrap gap-6 justify-center">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onOpen={() => navigate(`/product/${product.id}`)}
            />
          ))
        )}
      </div>

      {/* Pagination (unchanged) */}
    </div>
  );
}

export default ProductList;