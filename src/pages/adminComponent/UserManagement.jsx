import { useContext, useEffect, useState } from "react";
import AuthService from "../../services/AuthService";
import { AuthContext } from "../../context/-AuthContext";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const { token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const fetchAllUsers = async () => {
    try {
      const response = await AuthService.getAllUsers(token);
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await AuthService.deleteUser(token, userId);
        setUsers(users.filter((user) => user.id !== userId));
        console.log("User deleted:", userId);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await AuthService.updateUser(token, editUser); // assumes updateUser(token, userData)
      setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
      setShowModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <p>Here you can manage users: view, edit, delete.</p>

      {users.length > 0 ? (
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th> {/* Added status column */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td
                    style={{
                      fontWeight: "bold",
                      color: user.status === "ACTIVE" ? "green" : "red",
                      textTransform: "uppercase",
                    }}
                  >
                    {user.status}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found.</p>
      )}

      {/* MODAL */}
      {showModal && editUser && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit User</h3>
            <form onSubmit={handleUpdate}>
              <label>Username:</label>
              <input
                type="text"
                value={editUser.username}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                required
              />
              <label>Role:</label>
              <select
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <label>Status:</label> {/* New status field */}
              <select
                value={editUser.status}
                onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <div className="modal-buttons">
                <button type="submit" className="edit-btn">
                  Save
                </button>
                <button type="button" className="delete-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded CSS */}
      <style>{`
        .user-management {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #f4f6f8;
          color: #333;
        }

        .user-management h2 {
          color: #1a73e8;
        }

        .table-container {
          margin-top: 20px;
          overflow-x: auto;
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
        }

        .user-table th,
        .user-table td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .user-table th {
          background-color: #1a73e8;
          color: white;
        }

        .user-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .user-table tr:hover {
          background-color: #f1f1f1;
        }

        .edit-btn, .delete-btn {
          margin-right: 8px;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .edit-btn {
          background-color: #ffc107;
          color: #fff;
        }

        .delete-btn {
          background-color: #dc3545;
          color: #fff;
        }

        .edit-btn:hover {
          background-color: #e0a800;
        }

        .delete-btn:hover {
          background-color: #c82333;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          width: 400px;
          max-width: 90%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          font-family: Arial, sans-serif;
        }

        .modal h3 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 20px;
          color: #1a73e8;
        }

        .modal form {
          display: flex;
          flex-direction: column;
        }

        .modal label {
          margin-bottom: 6px;
          font-weight: bold;
        }

        .modal input,
        .modal select {
          margin-bottom: 16px;
          padding: 8px 10px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .modal-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }

        .modal .edit-btn {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 5px;
          cursor: pointer;
        }

        .modal .edit-btn:hover {
          background-color: #218838;
        }

        .modal .delete-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 5px;
          cursor: pointer;
        }

        .modal .delete-btn:hover {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
