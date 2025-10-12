import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import ReviewService from "../../services/ReviewService";
import { useAdminUI } from "../../context/AdminUIContext";
import { useNavigate } from "react-router-dom";

const ProductReviews = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyTexts, setReplyTexts] = useState({}); // store replies per review

  const { setActiveMenu } = useAdminUI();
  const navigate = useNavigate();

  const handleBack = () => {
    setActiveMenu("products");
    navigate("/admin-dashboard");
  };

  const fetchProduct = async () => {
    try {
      const response = await ProductService.getProductById(productId);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (!product)
    return (
      <p style={styles.error}>
        Product not found.
        <button onClick={handleBack} style={styles.backButton}>
          Go back
        </button>
      </p>
    );

  // Admin reply handler
  const handleAdminReply = async (reviewId) => {
    const reply = replyTexts[reviewId]?.trim();
    if (!reply) return alert("Reply cannot be empty.");

    try {
      await ReviewService.replyToAReview(reviewId, reply);

      // Update state locally
      const updatedReviews = product.reviewDTO.map((rev) =>
        rev.id === reviewId
          ? { ...rev, adminReply: reply, adminReplyDate: new Date().toISOString() }
          : rev
      );

      setProduct({ ...product, reviewDTO: updatedReviews });
      setReplyTexts({ ...replyTexts, [reviewId]: "" });
      alert("Reply submitted successfully!");
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Failed to submit reply.");
    }
  };

  // Admin delete review handler
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await ReviewService.deleteReview(reviewId);

      // Update state locally
      const updatedReviews = product.reviewDTO.filter((rev) => rev.id !== reviewId);
      setProduct({ ...product, reviewDTO: updatedReviews });
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Reviews for: {product.name}</h2>
        <button style={styles.backButton} onClick={handleBack}>
          ← Back to Products
        </button>
      </div>

      <div style={styles.productInfo}>
        <img
          src={`http://localhost:8989${product.imageUrl}`}
          alt={product.name}
          style={styles.image}
        />
        <div>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p>
            <strong>Tags:</strong>{" "}
            {product.tags && product.tags.length
              ? product.tags.join(", ")
              : "None"}
          </p>
        </div>
      </div>

      <h3 style={{ marginTop: "1.5rem" }}>User Reviews</h3>

      {product.reviewDTO && product.reviewDTO.length > 0 ? (
        <div style={styles.reviewList}>
          {product.reviewDTO.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <strong>{review.userName}</strong>
                <span style={styles.rating}>⭐ {review.rating}</span>
              </div>
              <p style={styles.comment}>"{review.comment}"</p>
              {review.adminReply && (
                <p style={styles.adminReply}>
                  <strong>Admin Reply:</strong> {review.adminReply}
                </p>
              )}
              <small style={styles.date}>
                {new Date(review.reviewDate).toLocaleString()}
              </small>

              {/* Admin reply and delete controls */}
              <div style={{ marginTop: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Type reply..."
                  value={replyTexts[review.id] || ""}
                  onChange={(e) =>
                    setReplyTexts({ ...replyTexts, [review.id]: e.target.value })
                  }
                  style={styles.replyInput}
                />
                <button
                  onClick={() => handleAdminReply(review.id)}
                  style={styles.replyButton}
                >
                  Reply
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noReviews}>No reviews yet for this product.</p>
      )}
    </div>
  );
};

// Inline styles
const styles = {
  container: { padding: "2rem", maxWidth: "800px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#1a73e8", fontWeight: "600" },
  backButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
  productInfo: { display: "flex", gap: "20px", marginTop: "1rem", background: "#f8f9fa", padding: "1rem", borderRadius: "8px" },
  image: { width: "100px", height: "100px", objectFit: "cover", borderRadius: "6px" },
  reviewList: { marginTop: "1rem" },
  reviewCard: { backgroundColor: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "1rem", marginBottom: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  reviewHeader: { display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" },
  rating: { color: "#ffc107" },
  comment: { fontStyle: "italic", color: "#333" },
  adminReply: { marginTop: "0.5rem", color: "#1a73e8" },
  date: { fontSize: "0.8rem", color: "#666" },
  noReviews: { textAlign: "center", color: "#777", marginTop: "1rem" },
  loading: { textAlign: "center", marginTop: "3rem" },
  error: { color: "red", textAlign: "center" },
  replyInput: { padding: "0.3rem 0.5rem", marginRight: "0.5rem", width: "60%" },
  replyButton: { padding: "0.3rem 0.5rem", backgroundColor: "#1a73e8", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  deleteButton: { padding: "0.3rem 0.5rem", marginLeft: "0.5rem", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
};

export default ProductReviews;
