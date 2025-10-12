import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AuthContext } from "../../context/-AuthContext";

const UserActivityOverview = () => {
  const { token } = useContext(AuthContext);
  const [period, setPeriod] = useState("daily"); // new
  const [activityData, setActivityData] = useState([]);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalOrders: 0,
    averageOrdersPerUser: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchActivity = async (selectedPeriod) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8989/reports/user-activity?period=${selectedPeriod}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data || {};

      setSummary({
        totalUsers: data.totalUsers ?? 0,
        activeUsers: data.activeUsers ?? 0,
        newUsers: data.newUsers ?? 0,
        totalOrders: data.totalOrders ?? 0,
        averageOrdersPerUser: data.averageOrdersPerUser ?? 0,
      });

      setActivityData(data.data ?? []);
    } catch (err) {
      console.error("Error fetching user activity:", err);
      setActivityData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchActivity(period);
  }, [token, period]);

  if (loading)
    return <div className="p-6">Loading user activity overview...</div>;

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">User Activity Overview</h2>

      {/* Period selector */}
      <div className="mb-4 flex gap-2">
        {["daily", "weekly", "monthly"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded ${
              period === p ? "bg-blue-600 text-white" : "bg-white border"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{summary.totalUsers}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Active Users</h3>
          <p className="text-2xl font-bold text-green-600">{summary.activeUsers}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">New Users</h3>
          <p className="text-2xl font-bold text-purple-600">{summary.newUsers}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
          <p className="text-2xl font-bold text-orange-600">{summary.totalOrders}</p>
        </div>
        <div className="p-4 bg-white rounded shadow text-center">
          <h3 className="text-lg font-semibold text-gray-600">Avg Orders/User</h3>
          <p className="text-2xl font-bold text-indigo-600">
            {summary.averageOrdersPerUser.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="p-4 bg-white rounded shadow">
        {activityData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#60a5fa" name="Orders" />
              <Bar dataKey="logins" fill="#34d399" name="Logins" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-10">
            No activity data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserActivityOverview;
