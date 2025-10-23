// src/pages/adminComponent/OrderManagement/OrderTable.jsx
const OrderTable = ({ orders, onEdit, onDelete, onDetails }) => {
  return (
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
                    onClick={() => onEdit(order)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => onDetails(order.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onDelete(order.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Cancel
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
  );
};

export default OrderTable;
