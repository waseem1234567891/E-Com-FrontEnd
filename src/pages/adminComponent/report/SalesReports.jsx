import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { AuthContext } from "../../../context/-AuthContext"; // import context

const SalesReports = () => {
  const { token } = useContext(AuthContext); // get token from context
  const [period, setPeriod] = useState("daily");
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrder: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchSales = async (selectedPeriod) => {
    if (!token) return; // ensure token exists

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8989/reports/sales?period=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token in headers
          },
        }
      );

      setData(res.data.data || []);
      setSummary({
        totalSales: res.data.totalSales,
        totalOrders: res.data.totalOrders,
        averageOrder: res.data.averageOrder,
      });
    } catch (err) {
      console.error("Error fetching sales report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(period);
  }, [period, token]); // refetch when period or token changes

  if (loading) return <div className="p-6">Loading sales report...</div>;

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Sales Report</h2>

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

      {/* Summary */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-xl">${summary.totalSales.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-xl">{summary.totalOrders}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-lg font-semibold">Average Order</h3>
          <p className="text-xl">${summary.averageOrder.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 bg-white rounded shadow">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#3182ce" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesReports;
