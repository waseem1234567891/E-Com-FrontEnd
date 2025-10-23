import React, { useState } from "react";

const CategoryModal = ({ show, onClose, onSubmit }) => {
  const [categoryName, setCategoryName] = useState("");

  if (!show) return null;

  const handleAdd = async () => {
    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }
    try {
      await onSubmit(categoryName);
      setCategoryName(""); // clear input
      onClose();
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h3>Add New Category</h3>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          style={modalStyles.input}
        />
        <div style={{ marginTop: "1rem" }}>
          <button style={styles.addButton} onClick={handleAdd}>
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
    padding: "0.5rem 1rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    marginRight: "8px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "0.5rem 1rem",
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
    padding: "0.5rem",
    fontSize: "1rem",
    marginBottom: "1rem",
  },
};

export default CategoryModal;
