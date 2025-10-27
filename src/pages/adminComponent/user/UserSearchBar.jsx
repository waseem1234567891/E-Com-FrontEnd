const UserSearchBar = ({ searchTerm, setSearchTerm, onSearch }) => (
  <div className="flex justify-between items-center mb-4">
    <input
      type="text"
      placeholder="Search by username or email..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border rounded-md p-2 w-1/3"
    />
    <button
      onClick={onSearch}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
    >
      Search
    </button>
  </div>
);
export default UserSearchBar;
