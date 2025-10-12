import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/-AuthContext";

const InventoryOverview = () => {
  const { token } = useContext(AuthContext);
  const [threshold, setThreshold] = useState(10);
  const [inventory, setInventory] = useState([]); // default = []
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8989/reports/inventory?threshold=${threshold}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ensure fallback to [] if response invalid
      const data = Array.isArray(res.data) ? res.data : [];
      setInventory(data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchInventory();
  }, [token, threshold]);

  if (loading) return <div className="p-6">Loading inventory data...</div>;

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Inventory Overview</h2>

      {/* Threshold input */}
      <div className="mb-4 flex items-center gap-3">
        <label className="font-semibold text-gray-700">
          Low Stock Threshold:
        </label>
        <input
          type="number"
          min="1"
          className="border rounded px-3 py-1 w-24"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
        <button
          onClick={fetchInventory}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Inventory table */}
      <div className="bg-white shadow rounded p-4 overflow-x-auto">
        {inventory && inventory.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Product</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-center">Stock</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={item.id || index} className="border-b hover:bg-gray-50">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 font-medium text-gray-800">{item.name}</td>
                  <td className="p-2 text-gray-600">{item.category}</td>
                  <td className="p-2 text-center">{item.stockQuantity}</td>
                  <td className="p-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.stockQuantity === 0
                          ? "bg-red-100 text-red-700"
                          : item.stockQuantity <= threshold
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.stockQuantity === 0
                        ? "Out of Stock"
                        : item.stockQuantity <= threshold
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-10">
            No low-stock products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default InventoryOverview;
