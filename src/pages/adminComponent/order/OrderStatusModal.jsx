// src/pages/adminComponent/OrderManagement/OrderStatusModal.jsx
const OrderStatusModal = ({ order, newStatus, setNewStatus, onClose, onUpdate }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Update Order Status</h3>
        <p className="mb-2">Order ID: {order?.id}</p>

        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="w-full border p-2 mb-4"
        >
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onUpdate}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;
