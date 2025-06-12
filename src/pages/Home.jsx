import React, { useState } from "react";
import ProductList from "./ProductList";
import Cart from "../components/Cart";

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Cart Sidebar */}
      <aside className="w-80 h-[calc(100vh-64px)] sticky top-[64px] bg-white p-4 border-r border-gray-300 shadow-md overflow-y-auto">
        <Cart />
      </aside>

      {/* Product Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            🛒 Welcome to the E-commerce App
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <ProductList key={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
