// src/pages/adminComponent/OrderManagement.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import OrderService from "../../services/OrderService";
import { AuthContext } from "../../context/-AuthContext";
import { useAdminUI } from "../../context/AdminUIContext";

const OrderManagement = () => {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const { setActiveMenu } = useAdminUI();

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Fetch orders with optional filters
  const fetchOrders = async (pageNumber = 0, status = selectedStatus, search = searchQuery) => {
    try {
      const response = await OrderService.getAllOrders(token, pageNumber, status, search);
      const data = response.data;
      setOrders(data.content || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.number || pageNumber);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await OrderService.updateOrderStatus(selectedOrder.id, newStatus, token);
      setShowModal(false);
      fetchOrders(page);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) fetchOrders(newPage);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value);
    fetchOrders(0, value, searchQuery);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(0, selectedStatus, searchQuery);
  };

  // Back to dashboard button
  const handleBackToDashboard = () => {
    if (role === "ADMIN") {
      setActiveMenu("orders");
      navigate("/admin-dashboard", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Order Management</h2>
      <button
        onClick={handleBackToDashboard}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Dashboard
      </button>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by Order ID, Username, Guest..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 w-64"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        <div>
          <label htmlFor="statusFilter" className="mr-2 text-gray-700 font-medium">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-1"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-3 border">Order ID</th>
              <th className="px-4 py-3 border">User</th>
              <th className="px-4 py-3 border">Total</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Payment</th>
              <th className="px-4 py-3 border">Shipping</th>
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">{order.id}</td>
                  <td className="px-4 py-3 border">
                    {order.userName || order.guestName || "Guest"}
                  </td>
                  <td className="px-4 py-3 border">₹{order.totalAmount}</td>
                  <td className="px-4 py-3 border">{order.status}</td>
                  <td className="px-4 py-3 border">{order.paymentStatus}</td>
                  <td className="px-4 py-3 border">{order.shippingAddress}</td>
                  <td className="px-4 py-3 border">{new Date(order.orderDate).toLocaleString()}</td>
                  <td className="px-4 py-3 border flex flex-col gap-1">
                    <button
                      onClick={() => handleOpenModal(order)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className={`px-3 py-1 rounded border ${page === 0 ? "text-gray-400 border-gray-300" : "hover:bg-gray-100"}`}
        >
          Previous
        </button>
        <span className="px-3 py-1 text-gray-700">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          className={`px-3 py-1 rounded border ${page + 1 >= totalPages ? "text-gray-400 border-gray-300" : "hover:bg-gray-100"}`}
        >
          Next
        </button>
      </div>

      {/* Status Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Update Order Status</h3>
            <p className="mb-2">Order ID: {selectedOrder?.id}</p>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border p-2 mb-4"
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
