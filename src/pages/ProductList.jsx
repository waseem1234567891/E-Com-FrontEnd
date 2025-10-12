import { useEffect, useState, useContext } from "react";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import ProCatService from "../services/ProCatService";
import ReviewService from "../services/ReviewService";
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const { refreshCartFlag, triggerCartRefresh } = useCartContext();
  const { userId, token } = useContext(AuthContext);

  // Open product modal and fetch reviews
  const openProductModal = async (product) => {
    setSelectedProduct(product);
    try {
      const response = await ReviewService.getReviewsByProductId(product.id);
      setReviews(response.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setNewRating(5);
    setNewComment("");
  };

  // Fetch product categories
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

  // Fetch paginated products
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

  // Add product to cart
  const handleAddToCart = async (product) => {
    if (!token) {
      const updatedCart = addToGuestCart(product);
      setProducts([...products]); // trigger re-render
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
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart.");
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(0);
  };

  // Submit a new review
  const handleSubmitReview = async () => {
    if (!token) {
      alert("You must be logged in to submit a review.");
      return;
    }
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    try {
      const payload = {
        rating: newRating,
        comment: newComment,
        productId: selectedProduct.id,
        userId: userId,
      };
      await ReviewService.createReview(payload);
      const response = await ReviewService.getReviewsByProductId(selectedProduct.id);
      setReviews(response.data || []);
      setNewRating(5);
      setNewComment("");
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-center mb-4">
        Product List (Page {page + 1} of {totalPages})
      </h2>

      {/* Search + Category Filter */}
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

      {/* Product Grid */}
      <div className="flex flex-wrap gap-6 justify-center">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => openProductModal(product)}
            className="border border-gray-300 rounded-xl p-4 bg-white shadow hover:shadow-md transition duration-200 w-full sm:w-[48%] md:w-[30%]"
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
              onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
              disabled={product.stock === 0}
              className={`${product.stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold py-2 px-4 rounded-lg shadow w-full transition`}
            >
              🛒 {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
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

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-md relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
            <img
              src={`http://localhost:8989${selectedProduct.imageUrl}`}
              alt={selectedProduct.name}
              className="w-full h-52 object-cover rounded mb-4"
            />
            <p className="text-lg mb-1">Price: ${selectedProduct.price}</p>
            <p className="text-md text-gray-600 mb-3">In Stock: {selectedProduct.stock}</p>
            <button
              onClick={() => handleAddToCart(selectedProduct)}
              disabled={selectedProduct.stock === 0}
              className={`${selectedProduct.stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold py-2 px-4 rounded-lg w-full mb-4`}
            >
              🛒 {selectedProduct.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            {/* ✅ Updated Reviews Section */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">
                Reviews ({reviews.length})
              </h3>
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-t py-3">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-800">
                        {review.userName || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-yellow-500">⭐ {review.rating}</p>
                    <p className="text-gray-700">{review.comment}</p>

                    {/* ✅ Admin Reply Display */}
                    {review.adminReply && (
                      <div className="mt-2 ml-4 p-3 bg-gray-100 border-l-4 border-blue-500 rounded">
                        <p className="text-sm font-semibold text-blue-700">
                          Admin Reply:
                        </p>
                        <p className="text-gray-800">{review.adminReply}</p>
                        {review.adminReplyDate && (
                          <p className="text-xs text-gray-500">
                            {new Date(review.adminReplyDate).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-xl font-semibold mb-2">Add Your Review</h3>
              <div className="flex flex-col gap-2">
                <label>
                  Rating:
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(parseInt(e.target.value))}
                    className="ml-2 border px-2 py-1 rounded"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Comment:
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full border px-2 py-1 rounded"
                  />
                </label>
                <button
                  onClick={handleSubmitReview}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
