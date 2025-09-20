import { useEffect, useState, useContext } from "react";
import OrderService from "../../services/OrderService";
import { AuthContext } from "../../context/-AuthContext";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await OrderService.getAllOrders(token);
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowModal(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await OrderService.updateOrderStatus(selectedOrder.id, newStatus, token);
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Order Management</h2>
      <p className="mb-6 text-gray-600">View and update customer orders.</p>

      {/* Filter */}
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 text-gray-700 font-medium">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
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
              <th className="px-4 py-3 border">Items</th>
              <th className="px-4 py-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders
                .filter((order) => !selectedStatus || order.status === selectedStatus)
                .map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">{order.id}</td>
                    <td className="px-4 py-3 border">{order.userName}</td>
                    <td className="px-4 py-3 border">₹{order.totalAmount}</td>
                    <td className="px-4 py-3 border">{order.status}</td>
                    <td className="px-4 py-3 border">{order.paymentStatus}</td>
                    <td className="px-4 py-3 border">{order.shippingAddress}</td>
                    <td className="px-4 py-3 border">
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 border">
                      <ul className="list-disc pl-4 space-y-1">
                        {order.items?.map((item, index) => (
                          <li key={index}>
                            <span className="font-medium">{item.product?.name}</span> ×{" "}
                            {item.quantity} – ₹
                            {item.price ?? item.product?.price ?? "N/A"}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 border">
                      <button
                        onClick={() => handleOpenModal(order)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
