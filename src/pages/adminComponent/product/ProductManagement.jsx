import React, { useState, useEffect, useContext } from "react";
import ProductService from "../../../services/ProductService";
import ProCatService from "../../../services/ProCatService";
import { AuthContext } from "../../../context/-AuthContext";
import AddStockModal from "./AddStockModal";
import Pagination from "../../../util/Pagination";
import ProductTable from "./ProductTable";
import ProductFormModal from "./ProductFormModal";
import CategoryModal from "./CategoryModal";
import ProductHeader from "./ProductHeader";
import useCategories from "./useCategories";
import useProducts from "./useProducts";
import EditCategoryModal from "./EditCategoryModal";


const ProductManagement = () => {

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: "",
    tags: [],
    stock: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const { token } = useContext(AuthContext);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);

  // Add stock modal state
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState(null);

//fetching product using useProduct hook
  const { products, page, totalPages, setPage, fetchProducts } =
    useProducts(selectedCategory);

  // Fetch categories using useCategory hook
  const { proCategories, fetchCategories } = useCategories();

  

  // Input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  // Add stock handler
  const handleAddStockClick = (product) => {
    setSelectedProductForStock(product);
    setShowStockModal(true);
  };

  // Add or update product
  const handleAddOrUpdate = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("categoryId", formData.categoryId);
      data.append("stock", formData.stock);
      if (imageFile) data.append("image", imageFile);
      data.append("tags", JSON.stringify(formData.tags));

      if (editingId) {
        await ProductService.updateProduct(editingId, data);
      } else {
        await ProductService.addProduct(data);
      }

      setFormData({ name: "", price: "", categoryId: "", tags: [], stock: 0 });
      setImageFile(null);
      setPreviewUrl("");
      setEditingId(null);
      setShowModal(false);
      fetchProducts(page);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Edit handler
  const handleEdit = (product) => {
    setFormData({
      name: product.name || "",
      price: product.price || "",
      categoryId: product.categoryId || "",
      tags: product.tags || [],
      stock: product.stock || 0,
    });
    setEditingId(product.id);
    setPreviewUrl(
      product.imageUrl ? `http://localhost:8989${product.imageUrl}` : ""
    );
    setShowModal(true);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await ProductService.deleteProduct(id, token);
        fetchProducts(page);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Product Management</h2>

       <ProductHeader
        onAddProduct={() => setShowModal(true)}
        onAddCategory={() => setShowCategoryModal(true)}
        onEditCategory={() => setShowEditCategoryModal(true)}
      />

       <ProductTable
    products={products}
    onEdit={handleEdit}
    onDelete={handleDelete}
    onAddStock={handleAddStockClick}
  />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
       onPageChange={handlePageChange}
     />

      {/* Product Modal */}
      <ProductFormModal
  show={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={handleAddOrUpdate}
  formData={formData}
  setFormData={setFormData}
  categories={proCategories}
  editingId={editingId}
  previewUrl={previewUrl}
  onImageChange={handleImageChange}
/>
{/* Add CategoryModel  */}
      <CategoryModal
  show={showCategoryModal}
  onClose={() => setShowCategoryModal(false)}
  onSubmit={async (name) => {
    await ProCatService.addCategory({
        proCatName: name
      });
    fetchCategories();
  }}
/>
<EditCategoryModal
  show={showEditCategoryModal}
  onClose={() => setShowEditCategoryModal(false)}
  categories={proCategories}
  onUpdated={fetchCategories}
/>

      {/* ✅ Add Stock Modal */}
      <AddStockModal
        show={showStockModal}
        onClose={() => setShowStockModal(false)}
        product={selectedProductForStock}
        token={token}
        onStockAdded={() => fetchProducts(page)}
      />
    </div>
  );
};

const styles = {
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  editButton: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "8px",
  },
  deleteButton: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "8px",
  },
  addStockButton: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
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

export default ProductManagement;
