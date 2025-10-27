// src/pages/adminComponent/OrderManagement.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import OrderService from "../../../services/OrderService";
import { AuthContext } from "../../../context/-AuthContext";
import { useAdminUI } from "../../../context/AdminUIContext";
import Pagination from "../../../util/Pagination";
import OrderFilter from "./OrderFilter";
import OrderTable from "./OrderTable";
import OrderStatusModal from "./OrderStatusModal";
import { useLocalNotification } from "../../../context/LocalNotificationContext";

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
  const { showNotification, message, type } = useLocalNotification();

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

  // ✅ Delete/cancel order
  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel/delete this order?"
    );
    if (!confirmDelete) return;

    try {
      await OrderService.cancelAnOrder(orderId, token);
      showNotification(`✅ Order no ${orderId} is Deleted successfully!`, "success");
      fetchOrders(page);
    } catch (error) {
      console.error("Error deleting order:", error);
      showNotification(`✅ Order no ${orderId} is not Deleted !`, "error");
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await OrderService.updateOrderStatus(selectedOrder.id, newStatus, token);
      
      setShowModal(false);
      
      fetchOrders(page);
      showNotification(`✅ Order no ${selectedOrder.id} is Updated successfully!`, "success");
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
       <OrderFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onSearch={fetchOrders}
      />

      {/* Orders Table */}
      <OrderTable
        orders={orders}
        onEdit={handleOpenModal}
        onDelete={handleDeleteOrder}
        onDetails={(id) => navigate(`/order-for-admin/${id}`)}
      />

      <Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>


      {/* Status Modal */}
      {showModal && (
       <OrderStatusModal
          order={selectedOrder}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          onClose={() => setShowModal(false)}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default OrderManagement;
