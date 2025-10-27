const UserTable = ({ users, onEdit, onDelete, onView }) => (
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
            <td className="py-2 px-4">{u.username}</td>
            <td className="py-2 px-4">{u.email}</td>
            <td className="py-2 px-4">{u.role}</td>
            <td className={`py-2 px-4 font-semibold ${u.status === "ACTIVE" ? "text-green-600" : "text-red-500"}`}>
              {u.status}
            </td>
            <td className="py-2 px-4 flex justify-center gap-2">
              <button onClick={() => onView(u.id)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                View
              </button>
              <button onClick={() => onEdit(u)} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm">
                Edit
              </button>
              <button onClick={() => onDelete(u.id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default UserTable;
