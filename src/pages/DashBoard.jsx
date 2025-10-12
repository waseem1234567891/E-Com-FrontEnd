import React, { useEffect, useState, useContext } from "react";
import DashboardService from "../services/DashboardService";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";
import OrderService from "../services/OrderService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/-AuthContext";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [profileForm, setProfileForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
  });

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const ORDER_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const STATUS_COLOR_MAP = {
    PENDING: "bg-yellow-500",
    CONFIRMED: "bg-indigo-500",
    PROCESSING: "bg-purple-500",
    SHIPPED: "bg-blue-500",
    DELIVERED: "bg-green-500",
    CANCELLED: "bg-red-500",
    RETURNED: "bg-pink-500",
  };

  const getProgress = (status) => {
    const index = ORDER_STEPS.indexOf(status);
    if (index === -1) return 0;
    if (status === "CANCELLED") return 100;
    return ((index + 1) / (ORDER_STEPS.length - 1)) * 100;
  };

  // Fetch user profile once
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await DashboardService.getDashboardData(token);
        setUser(res.data);
        setProfileForm({
          userName: res.data.userName || "",
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
        });
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        navigate("/login");
      }
    };
    if (token) fetchDashboard();
  }, [token, navigate]);

  // Fetch orders lazily when orders/history tab clicked
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id || (activeTab !== "orders" && activeTab !== "history")) return;
      setLoadingOrders(true);
      try {
        const res = await OrderService.getOrdersByUserId(user.id, token);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [activeTab, user, token]);

  // --- Profile ---
  const handleSaveProfile = async () => {
    try {
      // exclude userName and email from payload
      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
      };

      const res = await AuthService.updateProfile(user.id, payload, token);
      setUser({ ...user, ...res.data });
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile.");
    }
  };

  // --- Address Management ---
  const openAddModal = () => {
    setEditingAddress(null);
    setAddressForm({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
    setShowAddressModal(true);
  };

  const openEditModal = (addr) => {
    setEditingAddress(addr);
    setAddressForm(addr);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async () => {
    try {
      const payload = { ...addressForm, userId: user.id };
      if (editingAddress) {
        const res = await UserService.updateAddress(editingAddress.id, payload, token);
        setUser({
          ...user,
          addresses: user.addresses.map((a) =>
            a.id === editingAddress.id ? res.data : a
          ),
        });
      } else {
        const res = await UserService.addAddress(payload, token);
        setUser({ ...user, addresses: [...(user.addresses || []), res.data] });
      }
      setShowAddressModal(false);
    } catch (err) {
      console.error("Error saving address", err);
    }
  };

  const handleDeleteAddress = async (addr) => {
    try {
      await UserService.deleteAddress(user.id, addr.id, token);
      setUser({
        ...user,
        addresses: user.addresses.filter((a) => a.id !== addr.id),
      });
    } catch (err) {
      console.error("Error deleting address", err);
    }
  };

  // --- Cancel Order ---
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await OrderService.cancelAnOrder(orderId, token);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "CANCELLED" } : o))
      );
      alert("✅ Order cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("❌ Failed to cancel order.");
    }
  };

  // --- Render Orders ---
  const renderOrders = (list) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {list.length === 0 && <p className="text-gray-600 col-span-full">No orders found.</p>}
      {list.map((order) => {
        const progress = getProgress(order.status);
        const colorClass = STATUS_COLOR_MAP[order.status] || "bg-gray-400";

        return (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${colorClass}`}>
                  {order.status}
                </span>
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className={`${colorClass} h-2 rounded-full transition-all duration-300 ease-in-out`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                  {ORDER_STEPS.map((step) => (
                    <span key={step}>{step}</span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-700 space-y-1 mb-4">
                <p><span className="font-medium">Total:</span> ₹{order.totalAmount}</p>
                <p><span className="font-medium">Date:</span> {new Date(order.orderDate).toLocaleString()}</p>
                <p><span className="font-medium">Payment:</span> {order.paymentStatus} ({order.paymentMethod})</p>
                <p><span className="font-medium">Shipping:</span> {order.shippingAddress}</p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  View Details
                </button>

                {order.status !== "SHIPPED" &&
                  order.status !== "DELIVERED" &&
                  order.status !== "CANCELLED" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                    >
                      Cancel Order
                    </button>
                  )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-gradient-to-tr from-gray-100 to-white min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.firstName || ""} {user?.lastName || ""}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab("profile")} className={`px-4 py-2 rounded-lg shadow ${activeTab === "profile" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}>Profile</button>
        <button onClick={() => setActiveTab("orders")} className={`px-4 py-2 rounded-lg shadow ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}>Active Orders</button>
        <button onClick={() => setActiveTab("history")} className={`px-4 py-2 rounded-lg shadow ${activeTab === "history" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}>Order History</button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">Your Profile</h2>

          <div className="space-y-3">
            {/* Username (read-only) */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={profileForm.userName}
                disabled
                className="w-full border px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Editable first/last name */}
            {["firstName", "lastName"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  {field === "firstName" ? "First Name" : "Last Name"}
                </label>
                <input
                  type="text"
                  value={profileForm[field]}
                  placeholder={field}
                  onChange={(e) => setProfileForm({ ...profileForm, [field]: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md text-sm"
                />
              </div>
            ))}

            {/* Email (read-only) */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="text"
                value={user?.email || ""}
                disabled
                className="w-full border px-3 py-2 rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <button onClick={handleSaveProfile} className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm">
              Save Profile
            </button>
          </div>

          {/* Addresses */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Saved Addresses</h3>
              <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-md shadow">+ Add Address</button>
            </div>
            {user?.addresses?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
                    <div className="text-gray-700 space-y-1">
                      <p>{addr.street}, {addr.city}</p>
                      <p>{addr.state} {addr.postalCode}</p>
                      <p>{addr.country}</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => openEditModal(addr)} className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded-md">Edit</button>
                      <button onClick={() => handleDeleteAddress(addr)} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-600">No addresses saved.</p>}
          </div>
        </div>
      )}

      {activeTab === "orders" && renderOrders(orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"))}
      {activeTab === "history" && renderOrders(orders.filter((o) => o.status === "DELIVERED" || o.status === "CANCELLED"))}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingAddress ? "Edit Address" : "Add Address"}</h3>
            <div className="space-y-3">
              {["street", "city", "state", "postalCode", "country"].map(field => (
                <div key={field} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    placeholder={field}
                    value={addressForm[field]}
                    onChange={(e) => setAddressForm({ ...addressForm, [field]: e.target.value })}
                    className="w-full border px-3 py-2 rounded-md text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowAddressModal(false)} className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm">Cancel</button>
              <button onClick={handleSaveAddress} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
