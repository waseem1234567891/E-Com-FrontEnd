import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/-AuthContext";
import { useUserUl } from "../../context/UserUIContext";

import DashboardService from "../../services/DashboardService";
import UserService from "../../services/UserService";
import OrderService from "../../services/OrderService";
import AuthService from "../../services/AuthService";

import ProfileCard from "../userdashboard/ProfileCard";
import AddressCard from "../userdashboard/AddressCard";
import OrderCard from "../userdashboard/OrderCard";
import AddressModal from "./AddressModal";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: "", city: "", state: "", postalCode: "", country: "",
  });
  const [profileForm, setProfileForm] = useState({
    userName: "", firstName: "", lastName: "",
  });

  const { token } = useContext(AuthContext);
  const { activeTab, setActiveTab } = useUserUl();
  const navigate = useNavigate();

  // Fetch dashboard/user data
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
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        navigate("/login");
      }
    };
    if (token) fetchDashboard();
  }, [token, navigate]);

  // Fetch orders when tab changes
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

  // --- Profile handlers ---
  const handleSaveProfile = async () => {
    try {
      const payload = { firstName: profileForm.firstName, lastName: profileForm.lastName };
      const res = await AuthService.updateProfile(user.id, payload, token);
      setUser({ ...user, ...res.data });
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile.");
    }
  };

  // --- Address handlers ---
  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({ street: "", city: "", state: "", postalCode: "", country: "" });
    setShowAddressModal(true);
  };

  const openEditAddress = (addr) => {
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
          addresses: user.addresses.map((a) => (a.id === editingAddress.id ? res.data : a)),
        });
      } else {
        const res = await UserService.addAddress(payload, token);
        setUser({ ...user, addresses: [...(user.addresses || []), res.data] });
      }
      setShowAddressModal(false);
    } catch (err) {
      console.error("Error saving address:", err);
    }
  };

  const handleDeleteAddress = async (addr) => {
    try {
      await UserService.deleteAddress(user.id, addr.id, token);
      setUser({ ...user, addresses: user.addresses.filter((a) => a.id !== addr.id) });
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  // --- Orders handlers ---
  const handleCancelOrder = async (order) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await OrderService.cancelAnOrder(order.id, token);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: "CANCELLED" } : o))
      );
      alert("✅ Order cancelled successfully!");
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("❌ Failed to cancel order.");
    }
  };

  const handleViewOrder = (order) => {
    navigate(`/order-for-user/${order.id}`);
  };

  return (
    <div className="p-6 md:p-10 bg-gradient-to-tr from-gray-100 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        Welcome, {user?.firstName || ""} {user?.lastName || ""}
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["profile", "orders", "history"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg shadow ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            {tab === "profile" ? "Profile" : tab === "orders" ? "Active Orders" : "Order History"}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === "profile" && (
        <>
          <ProfileCard profileForm={profileForm} user={user} setProfileForm={setProfileForm} onSave={handleSaveProfile} />
          <div className="mt-6">
            <AddressCard
              addresses={user?.addresses || []}
              onEdit={openEditAddress}
              onDelete={handleDeleteAddress}
              onAdd={openAddAddress}
            />
          </div>
        </>
      )}

      {/* Orders tab */}
      {(activeTab === "orders" || activeTab === "history") && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {loadingOrders && <p>Loading orders...</p>}
          {orders
            .filter((o) =>
              activeTab === "orders"
                ? o.status !== "DELIVERED" && o.status !== "CANCELLED"
                : o.status === "DELIVERED" || o.status === "CANCELLED"
            )
            .map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancel={handleCancelOrder}
                onView={handleViewOrder}
              />
            ))}
        </div>
      )}

      {/* Address Modal */}
      <AddressModal
        show={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleSaveAddress}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        editingAddress={editingAddress}
      />
    </div>
  );
};

export default Dashboard;
