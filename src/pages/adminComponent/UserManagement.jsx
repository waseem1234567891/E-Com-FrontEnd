import { useContext, useEffect, useState } from "react";
import AuthService from "../../services/AuthService";
import { AuthContext } from "../../context/-AuthContext";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const {token}=useContext(AuthContext);

  const fetchAllUsers = async () => {
    try {
      const response = await AuthService.getAllUsers(token);
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (userId) => {
    // Redirect to edit page or open modal
    console.log("Edit user:", userId);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await AuthService.deleteUser(userId,token);
        setUsers(users.filter(user => user.id !== userId));
        console.log("User deleted:", userId);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
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
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(user.id)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found.</p>
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
      `}</style>
    </div>
  );
};

export default UserManagement;
