import React, { useState } from "react";
import ProCatService from "../../../services/ProCatService";

const EditCategoryModal = ({ show, onClose, categories = [], onUpdated }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");

  if (!show) return null;

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditedName(category.proCatName);
  };

  const handleSave = async () => {
    if (!editedName.trim()) return alert("Category name cannot be empty.");
    try {
      await ProCatService.updateCategory(editingCategory.proCatId, {
        proCatName: editedName,
      });
      setEditingCategory(null);
      setEditedName("");
      onUpdated(); // refresh category list
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDelete = async (proCatId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await ProCatService.deleteCategory(proCatId);
        onUpdated(); // refresh
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Edit Categories</h3>
        <div style={{ marginTop: "1rem" }}>
          {categories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {categories.map((cat) => (
                <li
                  key={cat.proCatId}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  {editingCategory?.proCatId === cat.proCatId ? (
                    <>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        style={styles.input}
                      />
                      <button style={styles.saveBtn} onClick={handleSave}>
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{cat.proCatName}</span>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          style={styles.editBtn}
                          onClick={() => handleEditClick(cat)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(cat.proCatId)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button style={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const styles = {
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
    maxHeight: "80vh",
    overflowY: "auto",
  },
  input: {
    padding: "0.4rem",
    flex: 1,
  },
  editBtn: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "0.3rem 0.6rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "0.3rem 0.6rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveBtn: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "0.3rem 0.6rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  closeBtn: {
    marginTop: "1rem",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default EditCategoryModal;
