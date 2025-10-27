import { useContext, useEffect, useState } from "react";
import AuthService from "../../../services/AuthService";
import { AuthContext } from "../../../context/-AuthContext";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../util/Pagination";
import{useLocalNotification} from "../../../context/LocalNotificationContext";
import UserTable from "./UserTable";
import UserSearchBar from "./UserSearchBar";
import UserEditModal from"./UserEditModal";
import UserDetailsModal from "./UserDetailsModal";


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const { token } = useContext(AuthContext);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const{showNotification,message,type}=useLocalNotification();


  const fetchAllUsers = async (pageNumber = 0, query="") => {
    try {
      const response = await AuthService.getAllUsersByPagination(token, pageNumber, pageSize,query);
      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages);
      setPage(response.data.number);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await AuthService.deleteUser(token, userId);
        setUsers(users.filter((u) => u.id !== userId));
        showNotification(`✅ User with id ${userId} is Deleted successfully!`, "success");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await AuthService.updateUser(token, editUser);
      setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
      setShowEditModal(false);
      showNotification(`✅ User with id ${editUser.id} is Updated successfully!`, "success");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleViewDetails = async (id) => {
   navigate(`/admin-dashboard/user-detail/${id}`);
  };

  useEffect(() => {
    fetchAllUsers(0);
  }, []);
// handle pagination handlePagechange
  const handlePageChange = (newPage) => {
  if (newPage >= 0 && newPage < totalPages) {
    setPage(newPage);          // Update state
    fetchAllUsers(newPage, searchTerm); // Fetch new page data
  }
};

return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-blue-600 mb-2">User Management</h2>
      <p className="text-gray-600 mb-6">View, edit, or delete users below.</p>

      <UserSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={() => fetchAllUsers(0, searchTerm)}
      />

      <UserTable
        users={users}
        onEdit={(u) => { setEditUser(u); setShowEditModal(true); }}
        onDelete={handleDelete}
        onView={(id) => navigate(`/admin-dashboard/user-detail/${id}`)}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />

      {showEditModal && (
        <UserEditModal
          user={editUser}
          setUser={setEditUser}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdate}
        />
      )}

      {detailUser && (
        <UserDetailsModal user={detailUser} onClose={() => setDetailUser(null)} />
      )}
    </div>
  );
};

export default UserManagement;
