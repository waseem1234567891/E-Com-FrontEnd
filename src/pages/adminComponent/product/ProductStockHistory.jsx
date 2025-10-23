import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../../../services/ProductService";
import StockHistoryService from "../../../services/StockHistoryService";
import { useAdminUI } from "../../../context/AdminUIContext";
import { AuthContext } from "../../../context/-AuthContext"; // import your AuthContext

const ProductStockHistory = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { setActiveMenu } = useAdminUI();
  const { token } = useContext(AuthContext); // get JWT token

  const [product, setProduct] = useState(null);
  const [stockHistory, setStockHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    setActiveMenu("products");
    navigate("/admin-dashboard");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pass token to service calls
        const [productRes, stockRes] = await Promise.all([
          ProductService.getProductById(productId, token),
          StockHistoryService.getHistoryByProduct(productId, token),
        ]);

        setProduct(productRes.data);
        setStockHistory(stockRes.data || []);
      } catch (err) {
        console.error("Error loading product or stock history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, token]);

  if (loading) return <p style={styles.loading}>Loading...</p>;

  if (!product)
    return (
      <p style={styles.error}>
        Product not found.
        <button onClick={handleBack} style={styles.backButton}>
          Go Back
        </button>
      </p>
    );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Stock History for: {product.name}</h2>
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
          <p><strong>Category:</strong> {product.productCategory?.proCatName || "N/A"}</p>
        </div>
      </div>

      <h3 style={{ marginTop: "1.5rem" }}>Stock Change Log</h3>

      {stockHistory.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Change</th>
              <th>Stock After</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {stockHistory.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.time).toLocaleString()}</td>
                <td
                  style={{
                    color: entry.quantityChanged > 0 ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {entry.quantityChanged > 0 ? "+" : ""}
                  {entry.quantityChanged}
                </td>
                <td>{entry.stockAfterChange}</td>
                <td>{entry.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.noData}>No stock history available.</p>
      )}
    </div>
  );
};

// === Inline Styles ===
const styles = {
  container: { padding: "2rem", maxWidth: "900px", margin: "0 auto" },
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
  productInfo: {
    display: "flex",
    gap: "20px",
    marginTop: "1rem",
    background: "#f8f9fa",
    padding: "1rem",
    borderRadius: "8px",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    backgroundColor: "#fff",
  },
  noData: { textAlign: "center", color: "#777", marginTop: "1rem" },
  loading: { textAlign: "center", marginTop: "3rem" },
  error: { color: "red", textAlign: "center" },
};

export default ProductStockHistory;
