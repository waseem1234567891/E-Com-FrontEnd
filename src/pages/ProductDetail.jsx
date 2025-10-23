// src/pages/ProductDetail.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate,useSearchParams } from "react-router-dom";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import ReviewService from "../services/ReviewService";
import { useCartContext } from "../context/CartContext";
import { AuthContext } from "../context/-AuthContext";
import { addToGuestCart } from "../util/guestCart";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();  // 👈 add this
  const [highlightReviewId, setHighlightReviewId] = useState(null); // 👈
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const { userId, token } = useContext(AuthContext);
  const { triggerCartRefresh } = useCartContext();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  useEffect(() => {
  const reviewIdFromUrl = searchParams.get("reviewId");
  if (reviewIdFromUrl) {
    setHighlightReviewId(Number(reviewIdFromUrl));
  }
}, [searchParams]);

useEffect(() => {
  if (highlightReviewId && reviews.length > 0) {
    const el = document.getElementById(`review-${highlightReviewId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("bg-yellow-100", "transition-colors", "duration-700");
      setTimeout(() => el.classList.remove("bg-yellow-100"), 3000);
    }
  }
}, [highlightReviewId, reviews]);



  const fetchProduct = async () => {
    try {
      const res = await ProductService.getProductById(id);
      setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await ReviewService.getReviewsByProductId(id);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      addToGuestCart(product);
      triggerCartRefresh();
      return;
    }

    try {
      await CartService.addToCart(product.id, userId, 1, token);
      triggerCartRefresh();
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart.");
    }
  };

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
        productId: id,
        userId: userId,
      };
      await ReviewService.createReview(payload);
      setNewRating(5);
      setNewComment("");
      fetchReviews();
      alert("Review submitted!");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!product) {
    return <div className="p-6 text-center text-gray-500">Loading product...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back to Products
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={`http://localhost:8989${product.imageUrl}`}
          alt={product.name}
          className="w-full md:w-1/2 h-80 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <p className="text-lg text-gray-700 mb-2">${product.price}</p>
          <p className="text-sm text-gray-600 mb-4">
            In Stock: {product.stock}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`${product.stock === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white font-semibold py-2 px-4 rounded-lg`}
          >
            🛒 {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-3">
          Reviews ({reviews.length})
        </h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id}
            id={`review-${r.id}`} // 👈 important
             className="border-t py-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{r.userName || "Anonymous"}</p>
                <p className="text-sm text-gray-500">
                  {new Date(r.reviewDate).toLocaleDateString()}
                </p>
              </div>
              <p className="text-yellow-500">⭐ {r.rating}</p>
              <p>{r.comment}</p>
              {r.adminReply && (
                <div className="mt-2 ml-4 p-3 bg-gray-100 border-l-4 border-blue-500 rounded">
                  <p className="text-sm font-semibold text-blue-700">
                    Admin Reply:
                  </p>
                  <p className="text-gray-800">{r.adminReply}</p>
                  {r.adminReplyDate && (
                    <p className="text-xs text-gray-500">
                      {new Date(r.adminReplyDate).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Review */}
      <div className="mt-8 border-t pt-4">
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
  );
}

export default ProductDetail;
