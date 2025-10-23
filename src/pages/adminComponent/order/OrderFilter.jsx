// src/pages/adminComponent/OrderManagement/OrderFilter.jsx
const OrderFilter = ({ searchQuery, setSearchQuery, selectedStatus, setSelectedStatus, onSearch }) => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(0, selectedStatus, searchQuery);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search by Order ID, Username, Guest..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 w-64"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <div>
        <label htmlFor="statusFilter" className="mr-2 text-gray-700 font-medium">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            onSearch(0, e.target.value, searchQuery);
          }}
          className="border border-gray-300 rounded px-3 py-1"
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>
    </div>
  );
};

export default OrderFilter;
