import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";

const ProductDetailForAdmin = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await ProductService.getProductById(productId);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) return <p style={{ padding: "2rem" }}>Loading product...</p>;

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate(-1)}>
        ← Back to Products
      </button>

      <div style={styles.header}>
        <img
          src={`http://localhost:8989${product.imageUrl}`}
          alt={product.name}
          style={styles.image}
        />
        <div>
          <h2 style={styles.title}>{product.name}</h2>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Category:</strong> {product.proCatId}</p>
          <p><strong>Tags:</strong> {product.tags?.join(", ") || "No tags"}</p>

          {/* --- New Buttons --- */}
          <div style={styles.buttonGroup}>
            <button
              style={styles.actionButton}
              onClick={() => navigate(`/admin-dashboard/product-reviews/${productId}`)}
            >
              View Reviews
            </button>
            <button
              style={styles.actionButton}
              onClick={() => navigate(`/admin-dashboard/product-stock-history/${productId}`)}
            >
              View Stock History
            </button>
          </div>
        </div>
      </div>

      <div style={styles.infoBox}>
        <h3>Product Details</h3>
        <p><strong>ID:</strong> {product.id}</p>
        <p><strong>Name:</strong> {product.name}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Category:</strong> {product.proCatId}</p>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "2rem", fontFamily: "Arial, sans-serif" },
  backButton: {
    marginBottom: "1rem",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: "2rem",
    marginBottom: "1.5rem",
  },
  image: {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  title: { marginBottom: "0.5rem" },
  buttonGroup: {
    marginTop: "1rem",
    display: "flex",
    gap: "10px",
  },
  actionButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
  infoBox: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "1rem",
    backgroundColor: "#fff",
    maxWidth: "600px",
  },
};

export default ProductDetailForAdmin;
