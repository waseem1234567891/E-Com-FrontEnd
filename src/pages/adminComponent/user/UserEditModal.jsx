import React from "react";

const UserEditModal = ({ user, setUser, onClose, onSave }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h3 className="text-xl font-semibold text-blue-600 mb-4">Edit User</h3>
        <form onSubmit={onSave} className="space-y-3">
          <div>
            <label className="font-semibold text-sm">Username</label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="font-semibold text-sm">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div>
            <label className="font-semibold text-sm">Role</label>
            <select
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              className="w-full border p-2 rounded-md"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-sm">Status</label>
            <select
              value={user.status}
              onChange={(e) => setUser({ ...user, status: e.target.value })}
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
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
