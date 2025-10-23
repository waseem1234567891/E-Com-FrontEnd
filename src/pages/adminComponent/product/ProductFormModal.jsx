import React, { useState } from "react";

const ProductFormModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  categories,
  editingId,
  previewUrl,
  onImageChange,
}) => {
  const [tagInput, setTagInput] = useState("");

  if (!show) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput("");
      e.preventDefault();
    }
  };

  const removeTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h3 style={{ marginBottom: "1rem" }}>
          {editingId ? "Edit Product" : "Add New Product"}
        </h3>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
          style={modalStyles.input}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          style={modalStyles.input}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={formData.stock}
          onChange={handleInputChange}
          style={modalStyles.input}
        />

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          style={modalStyles.input}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.proCatId} value={cat.proCatId}>
              {cat.proCatName}
            </option>
          ))}
        </select>

        {/* Tags input */}
        <input
          type="text"
          placeholder="Enter a tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          style={modalStyles.input}
        />

        <div style={modalStyles.tagContainer}>
          {formData.tags.map((tag, index) => (
            <span key={index} style={modalStyles.tag}>
              {tag}
              <button
                onClick={() => removeTag(index)}
                style={modalStyles.removeTagBtn}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={onImageChange}
          style={modalStyles.input}
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: "100px",
              height: "100px",
              marginTop: "10px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}

        <div style={{ marginTop: "1.5rem" }}>
          <button
            style={styles.saveButton}
            onClick={() => {
              onSubmit();
            }}
          >
            {editingId ? "Update" : "Add"}
          </button>

          <button
            style={styles.cancelButton}
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  saveButton: {
    padding: "0.5rem 1.2rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "8px",
  },
  cancelButton: {
    padding: "0.5rem 1.2rem",
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
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "0.5rem",
  },
  tag: {
    backgroundColor: "#e0e0e0",
    padding: "4px 8px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  removeTagBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "red",
    fontWeight: "bold",
  },
};

export default ProductFormModal;
