import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import ProCatService from '../../services/ProCatService';
import { AuthContext } from "../../context/-AuthContext";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', categoryId: '', tags: [], stock: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [proCategories, setProCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [tagInput, setTagInput] = useState('');
  const { token } = useContext(AuthContext);

  const fetchProducts = async (pageNumber = 0, categoryId = selectedCategory) => {
    try {
      const response = await ProductService.getProductsPaginated(
        pageNumber,
        6,
        categoryId === "All" || categoryId === "" ? null : categoryId
      );
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ProCatService.getAllCateGory();
      setProCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts(page, selectedCategory);
    fetchCategories();
  }, [page, selectedCategory]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl('');
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('categoryId', formData.categoryId);
      data.append('stock', formData.stock);
      if (imageFile) data.append('image', imageFile);
      data.append('tags', JSON.stringify(formData.tags));

      if (editingId) {
        await ProductService.updateProduct(editingId, data);
      } else {
        await ProductService.addProduct(data);
      }

      setFormData({ name: '', price: '', categoryId: '', tags: [], stock: 0 });
      setImageFile(null);
      setPreviewUrl('');
      setEditingId(null);
      setShowModal(false);
      fetchProducts(page);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      price: product.price || '',
      categoryId: product.categoryId || '',
      tags: product.tags || [],
      stock: product.stock || 0,
    });
    setEditingId(product.id);
    setPreviewUrl(product.imageUrl ? `http://localhost:8989${product.imageUrl}` : '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await ProductService.deleteProduct(id, token);
        fetchProducts(page);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Product Management</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
        <button
          style={{ ...styles.button, backgroundColor: '#007bff' }}
          onClick={() => {
            setFormData({ name: '', price: '', categoryId: '', tags: [], stock: 0 });
            setImageFile(null);
            setPreviewUrl('');
            setEditingId(null);
            setShowModal(true);
          }}
        >
          Add New Product
        </button>

        <button
          style={{ ...styles.button, backgroundColor: '#17a2b8' }}
          onClick={() => {
            setNewCategoryName('');
            setShowCategoryModal(true);
          }}
        >
          Add New Category
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price ($)</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Tags</th>
            <th>Actions</th>
            <th>Reviews</th>
          </tr>
        </thead>
        <tbody>
          {products.length ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  {product.imageUrl ? (
                    <img
                      src={`http://localhost:8989${product.imageUrl}`}
                      alt={product.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>
                  {product.tags && product.tags.length ? (
                    product.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          marginRight: '6px',
                          background: '#f1f1f1',
                          padding: '2px 6px',
                          borderRadius: '6px',
                        }}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span>No Tags</span>
                  )}
                </td>
                <td>
                  <button style={styles.editButton} onClick={() => handleEdit(product)}>Edit</button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
                <td>
                   <Link to={`/admin-dashboard/product-reviews/${product.id}`}>
    <button style={{ ...styles.button, backgroundColor: '#ffc107' }}>
      View Reviews
    </button>
  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" align="center">No products available.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
          Prev
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {page + 1} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>
          Next
        </button>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
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
              {proCategories.map((cat) => (
                <option key={cat.proCatId} value={cat.proCatId}>
                  {cat.proCatName}
                </option>
              ))}
            </select>

            {/* Tag Input */}
            <input
              type="text"
              placeholder="Enter a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  if (!formData.tags.includes(tagInput.trim())) {
                    setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
                  }
                  setTagInput('');
                  e.preventDefault();
                }
              }}
              style={modalStyles.input}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '0.5rem' }}>
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#e0e0e0',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {tag}
                  <button
                    onClick={() => {
                      setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
                    }}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: 'red',
                      fontWeight: 'bold',
                    }}
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
              onChange={handleImageChange}
              style={modalStyles.input}
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{ width: '100px', marginTop: '10px', objectFit: 'cover' }}
              />
            )}
            <div style={{ marginTop: '1rem' }}>
              <button style={styles.editButton} onClick={handleAddOrUpdate}>
                {editingId ? 'Update' : 'Add'}
              </button>
              <button style={styles.button} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>Add New Category</h3>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              style={modalStyles.input}
            />
            <div style={{ marginTop: '1rem' }}>
              <button
                style={styles.editButton}
                onClick={async () => {
                  try {
                    if (!newCategoryName.trim()) {
                      alert("Category name is required");
                      return;
                    }
                    await ProCatService.addCategory(newCategoryName);
                    fetchCategories();
                    setShowCategoryModal(false);
                  } catch (err) {
                    console.error("Error adding category:", err);
                  }
                }}
              >
                Add
              </button>
              <button style={styles.button} onClick={() => setShowCategoryModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  editButton: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  deleteButton: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    margin: '0.5rem 0',
    padding: '0.5rem',
    fontSize: '1rem',
  },
};

export default ProductManagement;
