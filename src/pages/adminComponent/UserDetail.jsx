import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { AuthContext } from "../../context/-AuthContext";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await AuthService.getUserDetails(token, userId);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [userId, token]);

  if (!user) {
    return <p className="p-6 text-gray-500">Loading user details...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">User Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          ← Back
        </button>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-3 text-blue-600">{user.username}</h3>
        <div className="space-y-2">
          <p><span className="font-semibold">Full Name:</span> {user.firstName} {user.lastName}</p>
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Role:</span> {user.role}</p>
          <p><span className="font-semibold">Status:</span> {user.status}</p>
          <p><span className="font-semibold">Last Login:</span> {user.lastLogin || "N/A"}</p>
        </div>
      </div>

      {/* Addresses */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
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

      {/* Orders (Summary Only) */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-semibold mb-3">Orders</h4>
        {user.orders?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Order ID</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Total (₹)</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Payment</th>
                  <th className="py-2 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {user.orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-2 px-4">{order.id}</td>
                    <td className="py-2 px-4">
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                    <td className="py-2 px-4">₹{order.totalAmount}</td>
                    <td
                      className={`py-2 px-4 font-semibold ${
                        order.status === "DELIVERED"
                          ? "text-green-600"
                          : order.status === "CANCELLED"
                          ? "text-red-500"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="py-2 px-4">
                      {order.paymentMethod} ({order.paymentStatus})
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Link
                        to={`/order-for-admin/${order.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
