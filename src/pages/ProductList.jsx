import { useEffect, useState } from "react";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import { useCartContext } from "../context/CartContext";
import ProCatService from "../services/ProCatService";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { refreshCartFlag, triggerCartRefresh } = useCartContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  
//open
const openProductModal = (product) => {
  setSelectedProduct(product);
};

const closeModal = () => {
  setSelectedProduct(null);
};



   // Fetch product categories
 const fetchProductCaregory = async () => {
    try {
      const response = await ProCatService.getAllCateGory();
      console.log("Category response:", response);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading product categories:", error);
    }
  };

  useEffect(() => {
    fetchProductCaregory();
  }, []);


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

  useEffect(() => {
    fetchProducts(page,selectedCategory);
  }, [page, refreshCartFlag,selectedCategory]);

  const handleAddToCart = async (productId, productName, productImage,productPrice) => {
    try {
      await CartService.addToCart(productId, productName, productImage,productPrice, 1);
      
      triggerCartRefresh();
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart.");
    }
  };

 const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(0); // Reset to first page when category changes
  };

 return (
  <div className="p-4">
    <h2 className="text-xl font-semibold text-center mb-4">
      Product List (Page {page + 1} of {totalPages})
    </h2>

    <div className="flex justify-center mb-4">
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        required
        className="add-product-input"
      >
        <option value="">-- Select Category --</option>
        {categories?.map((cat) => (
          <option key={cat.proCatId} value={cat.proCatId}>
            {cat.proCatName}
          </option>
        ))}
      </select>
    </div>

    <div className="flex flex-wrap gap-6 justify-center">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => openProductModal(product)}
          className="border border-gray-300 rounded-xl p-4 bg-white shadow hover:shadow-md transition duration-200 w-full sm:w-[48%] md:w-[30%]"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-gray-600 mb-2">Price: ${product.price}</p>
          <img
            src={`http://localhost:8989${product.imagePath}`}
            alt={product.name}
            className="w-full h-40 object-cover rounded mb-3"
          />
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening modal
              handleAddToCart(product.id, product.name, product.imagePath, product.price);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow w-full transition"
          >
            🛒 Add to Cart
          </button>
        </div>
      ))}
    </div>

    <div className="mt-6 flex justify-center space-x-4">
      <button
        disabled={page === 0}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <button
        disabled={page + 1 === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>

    {/* ✅ Place modal INSIDE return block */}
    {selectedProduct && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-11/12 max-w-md relative">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
          <img
            src={`http://localhost:8989${selectedProduct.imagePath}`}
            alt={selectedProduct.name}
            className="w-full h-52 object-cover rounded mb-4"
          />
          <p className="text-lg mb-2">Price: ${selectedProduct.price}</p>
          <button
            onClick={() =>
              handleAddToCart(
                selectedProduct.id,
                selectedProduct.name,
                selectedProduct.imagePath,
                selectedProduct.price
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-full"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    )}
  </div>
);

  
}

export default ProductList;
