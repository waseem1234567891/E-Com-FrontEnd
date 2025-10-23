import { useContext, useEffect, useState } from "react";
import AuthService from "../../../services/AuthService";
import { AuthContext } from "../../../context/-AuthContext";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../util/Pagination";


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const { token } = useContext(AuthContext);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();


  const fetchAllUsers = async (pageNumber = 0, query="") => {
    try {
      const response = await AuthService.getAllUsersByPagination(token, pageNumber, pageSize,query);
      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await AuthService.deleteUser(token, userId);
        setUsers(users.filter((u) => u.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await AuthService.updateUser(token, editUser);
      setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleViewDetails = async (id) => {
   navigate(`/admin-dashboard/user-detail/${id}`);
  };

  useEffect(() => {
    fetchAllUsers(0);
  }, []);
// handle pagination handlePagechange
  const handlePageChange = (newPage) => {
  if (newPage >= 0 && newPage < totalPages) {
    setPage(newPage);          // Update state
    fetchAllUsers(newPage, searchTerm); // Fetch new page data
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-blue-600 mb-2">User Management</h2>
      <p className="text-gray-600 mb-6">View, edit, or delete users below.</p>
      <div className="flex justify-between items-center mb-4">
  <input
    type="text"
    placeholder="Search by username or email..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border rounded-md p-2 w-1/3"
  />
  <button
    onClick={() => fetchAllUsers(0, searchTerm)}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
  >
    Search
  </button>
</div>


      {users.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{u.id}</td>
                  <td className="py-2 px-4">{u.username || "-"}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{u.role}</td>
                  <td
                    className={`py-2 px-4 font-semibold ${
                      u.status === "ACTIVE" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {u.status}
                  </td>
                  <td className="py-2 px-4 flex justify-center gap-2">
                    <button
                      onClick={() => handleViewDetails(u.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <p className="text-gray-600">No users found.</p>
      )}

      {/* === Edit Modal === */}
      {showEditModal && editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">Edit User</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="font-semibold text-sm">Username</label>
                <input
                  type="text"
                  value={editUser.username}
                  onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="font-semibold text-sm">Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="font-semibold text-sm">Role</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-sm">Status</label>
                <select
                  value={editUser.status}
                  onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                  className="w-full border p-2 rounded-md"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === View Details Modal === */}
      {detailUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setDetailUser(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-blue-600 mb-4">User Details</h3>

            <div className="space-y-2">
              <p><span className="font-semibold">Name:</span> {detailUser.firstName} {detailUser.lastName}</p>
              <p><span className="font-semibold">Email:</span> {detailUser.email}</p>
              <p><span className="font-semibold">Role:</span> {detailUser.role}</p>
              <p><span className="font-semibold">Status:</span> {detailUser.status}</p>
              <p><span className="font-semibold">Last Login:</span> {detailUser.lastLogin || "N/A"}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Addresses</h4>
              {detailUser.addresses?.length ? (
                <ul className="space-y-2">
                  {detailUser.addresses.map((a) => (
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
              {detailUser.orders?.length ? (
                detailUser.orders.map((order, i) => (
                  <div key={i} className="border rounded-lg p-3 bg-gray-50 mb-3">
                    <p><span className="font-semibold">Shipping:</span> {order.shippingAddress}</p>
                    <p><span className="font-semibold">Payment:</span> {order.paymentMethod}</p>
                    <p><span className="font-semibold">Total:</span> ₹{order.totalAmount}</p>
                    <p><span className="font-semibold">Order Status:</span> ₹{order.orderStatus}</p>

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
      )}
    </div>
  );
};

export default UserManagement;
