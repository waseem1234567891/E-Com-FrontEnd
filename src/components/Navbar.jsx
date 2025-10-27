import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/-AuthContext";
import { useNotifications } from "../context/NotificationContext";
import "./Navbar.css";

const Navbar = () => {
  const { username, logout, role } = useContext(AuthContext);
  const { notifications } = useNotifications();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Update unread count
  useEffect(() => {
    if (!dropdownOpen) setUnreadCount(notifications.length);
  }, [notifications, dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate(role === "ADMIN" ? "/admin-login" : "/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
    if (!dropdownOpen) setUnreadCount(0);
  };

  const sortedNotifications = [...notifications].sort((a, b) => b.id.toString().localeCompare(a.id.toString()));

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-links">
          <Link to={role === "ADMIN" ? "/admin-dashboard" : "/"} className="navbar-link">Home</Link>
          {role !== "ADMIN" && <Link to="/register" className="navbar-link">Register</Link>}
          {!username && <Link to="/login" className="navbar-link">Login</Link>}
        </div>

        <div className="navbar-right">
          {username && (
            <div className="relative">
              <button onClick={toggleDropdown} className="navbar-link relative">
                🔔
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              {dropdownOpen && (
                <div className="notification-dropdown">
                  {sortedNotifications.length === 0 ? (
                    <p className="text-gray-500 p-2">No notifications</p>
                  ) : (
                    <ul>
                      {sortedNotifications.slice(0, 6).map(n => (
                        <li
                          key={n.id} // ✅ unique key
                          className={`notification-item ${n.type || ""}`}
                          style={{
                            backgroundColor: n.from === "admin" ? "#fff7e6" : "white",
                            borderLeft: n.from === "admin" ? "4px solid #ff9800" : "4px solid #2196f3",
                          }}
                        >
                          {n.link ? (
                            n.link.startsWith("http") ? (
                              <a href={n.link} target="_blank" rel="noopener noreferrer" onClick={() => setDropdownOpen(false)}>
                                {n.from === "admin" && <strong>[ADMIN] </strong>}
                                {n.message}
                              </a>
                            ) : (
                              <Link to={n.link} onClick={() => setDropdownOpen(false)}>
                                {n.from === "admin" && <strong>[ADMIN] </strong>}
                                {n.message}
                              </Link>
                            )
                          ) : (
                            <span>{n.from === "admin" && <strong>[ADMIN] </strong>}{n.message}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link to="/notifications" className="text-blue-600 text-sm block text-center mt-1" onClick={() => setDropdownOpen(false)}>
                    See all
                  </Link>
                </div>
              )}
            </div>
          )}

          {username && (
            <>
              <span className="navbar-username" onClick={() => navigate(role === "ADMIN" ? "/admin-dashboard" : "/dashboard")} style={{ cursor: "pointer" }}>
                {username}
              </span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
