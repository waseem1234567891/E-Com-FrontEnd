// src/pages/adminComponent/ProductTable.jsx
import { Link } from "react-router-dom";

const ProductTable = ({ products, onEdit, onDelete, onAddStock }) => {
  return (
    <table className="w-full border-collapse mt-4">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Price ($)</th><th>Stock</th>
          <th>Image</th><th>Tags</th><th>Actions</th><th>Details</th>
        </tr>
      </thead>
      <tbody>
        {products.length ? (
          products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>
                {p.imageUrl ? (
                  <img
                    src={`http://localhost:8989${p.imageUrl}`}
                    alt={p.name}
                    className="w-[60px] h-[60px] object-cover"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>
                {p.tags?.length
                  ? p.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-block bg-gray-200 rounded px-2 py-1 mr-1"
                      >
                        {tag}
                      </span>
                    ))
                  : "No Tags"}
              </td>
              <td>
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded mr-1"
                  onClick={() => onEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded mr-1"
                  onClick={() => onDelete(p.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() => onAddStock(p)}
                >
                  Add Stock
                </button>
              </td>
              <td>
                <Link to={`/admin-dashboard/product-reviews/${p.id}`}>
                  <button className="bg-yellow-500 px-2 py-1 rounded text-white mr-1">
                    Reviews
                  </button>
                </Link>
                <Link to={`/admin-dashboard/product-stock-history/${p.id}`}>
                  <button className="bg-yellow-500 px-2 py-1 rounded text-white">
                    History
                  </button>
                </Link>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center py-4">
              No products available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ProductTable;
