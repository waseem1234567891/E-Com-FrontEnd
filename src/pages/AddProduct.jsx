import { useState, useEffect } from "react";
import ProductService from "../services/ProductService";
import ProCatService from "../services/ProCatService";
import "./AddProduct.css"; // ✅ Import CSS

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [proCatgories, setProCatgories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchProductCaregory = async () => {
    try {
      const response = await ProCatService.getAllCateGory();
      console.log("Category response:", response);
      setProCatgories(response.data || []);
    } catch (error) {
      console.error("Error loading product categories:", error);
    }
  };

  useEffect(() => {
    fetchProductCaregory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("image", image);
      formData.append("categoryId", selectedCategory);

      const response = await ProductService.addProduct(formData);
      setMessage("✅ Product added successfully!");
      console.log("Product response:", response.data);
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("❌ Failed to add product.");
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="add-product-title">Add Product</h2>
      {message && <p className="add-product-message">{message}</p>}
      <form onSubmit={handleSubmit} className="add-product-form">
        <label className="add-product-label">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter product name"
          required
          className="add-product-input"
        />

        <label className="add-product-label">Price</label>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Enter price"
          required
          className="add-product-input"
        />

        <label className="add-product-label">Category</label>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          required
          className="add-product-input"
        >
          <option value="">-- Select Category --</option>
          {proCatgories?.map(cat => (
            <option key={cat.proCatId} value={cat.proCatId}>
              {cat.proCatName}
            </option>
          ))}
        </select>

        <label className="add-product-label">Image</label>
        <input
          type="file"
          onChange={e => setImage(e.target.files[0])}
          accept="image/*"
          required
          className="add-product-file"
        />

        <button type="submit" className="add-product-button">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
