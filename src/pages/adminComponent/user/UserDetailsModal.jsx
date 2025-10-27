import React from "react";

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-blue-600 mb-4">User Details</h3>

        <div className="space-y-2">
          <p><span className="font-semibold">Name:</span> {user.firstName} {user.lastName}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Role:</span> {user.role}</p>
          <p><span className="font-semibold">Status:</span> {user.status}</p>
          <p><span className="font-semibold">Last Login:</span> {user.lastLogin || "N/A"}</p>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Addresses</h4>
          {user.addresses?.length ? (
            <ul className="space-y-2">
              {user.addresses.map((a) => (
                <li key={a.id} className="border p-2 rounded-md bg-gray-50">
                  {a.street}, {a.postalCode}, {a.country}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No addresses found.</p>
          )}
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Orders</h4>
          {user.orders?.length ? (
            user.orders.map((order, i) => (
              <div key={i} className="border rounded-lg p-3 bg-gray-50 mb-3">
                <p><span className="font-semibold">Shipping:</span> {order.shippingAddress}</p>
                <p><span className="font-semibold">Payment:</span> {order.paymentMethod}</p>
                <p><span className="font-semibold">Total:</span> ₹{order.totalAmount}</p>
                <p><span className="font-semibold">Order Status:</span> {order.orderStatus}</p>

                <ul className="mt-2 space-y-2">
                  {order.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 border rounded-md bg-white p-2">
                      <img
                        src={`http://localhost:8989${item.imageUrl}`}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.productName}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × ₹{item.productPrice}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
