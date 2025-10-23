import React, { useContext, useState } from "react";
import ProductService from "../../../services/ProductService";
import { AuthContext } from "../../../context/-AuthContext";

const AddStockModal = ({ show, onClose, product, onStockAdded, token }) => {
  const [stockToAdd, setStockToAdd] = useState(0);
  

  if (!show || !product) return null;

  const handleAddStock = async () => {
    try {
      if (stockToAdd <= 0) {
        alert("Please enter a valid stock number.");
        return;
      }

      await ProductService.addStock(product.id, stockToAdd, token);

      onStockAdded(); // tell parent to refresh
      onClose();
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h3>Add Stock for {product.name}</h3>
        <input
          type="number"
          placeholder="Enter stock to add"
          value={stockToAdd}
          onChange={(e) => setStockToAdd(Number(e.target.value))}
          style={modalStyles.input}
        />
        <div style={{ marginTop: "1rem" }}>
          <button style={styles.addButton} onClick={handleAddStock}>
            Add
          </button>
          <button style={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  addButton: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "8px",
  },
  cancelButton: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    width: "400px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    margin: "0.5rem 0",
    padding: "0.5rem",
    fontSize: "1rem",
  },
};

export default AddStockModal;
