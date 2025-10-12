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

  // Keep unread count updated
  useEffect(() => {
    if (!dropdownOpen) setUnreadCount(notifications.length);
  }, [notifications, dropdownOpen]);

  // Debug log (optional)
  useEffect(() => {
    console.log("🔔 Notifications updated:", notifications);
  }, [notifications]);

  const handleLogout = () => {
    logout();
    if (role === "ADMIN") navigate("/admin-login");
    else navigate("/login");
  };

  const handleUserClick = () => {
    if (role === "ADMIN") navigate("/admin-dashboard");
    else navigate("/dashboard");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    if (!dropdownOpen) setUnreadCount(0);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ==== LEFT LINKS ==== */}
        <div className="navbar-links">
          {/* Dynamic Home Link */}
          <Link
            to={role === "ADMIN" ? "/admin-dashboard" : "/"}
            className="navbar-link"
          >
            Home
          </Link>

          {/* Regular users can register */}
          {role !== "ADMIN" && (
            <Link to="/register" className="navbar-link">
              Register
            </Link>
          )}

          {/* Show login only if not logged in */}
          {!username && (
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          )}
        </div>

        {/* ==== RIGHT SIDE ==== */}
        <div className="navbar-right">
          {username && (
            <div className="relative">
              <button onClick={toggleDropdown} className="navbar-link relative">
                🔔
                {(unreadCount > 0 || notifications.length > 0) && (
                  <span className="notification-badge">
                    {unreadCount || notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {dropdownOpen && (
                <div
                  key={notifications.map((n) => n.id).join("-")}
                  className="notification-dropdown"
                >
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 p-2">No notifications</p>
                  ) : (
                    <ul>
                      {[...notifications]
                        .sort((a, b) => b.id - a.id)
                        .slice(0, 5)
                        .map((n) => (
                          <li key={n.id} className="notification-item">
                            {n.message}
                          </li>
                        ))}
                    </ul>
                  )}
                  <Link
                    to="/notifications"
                    className="text-blue-600 text-sm block text-center mt-1"
                    onClick={() => setDropdownOpen(false)}
                  >
                    See all
                  </Link>
                </div>
              )}
            </div>
          )}

          {username && (
            <>
              <span
                className="navbar-username"
                onClick={handleUserClick}
                style={{ cursor: "pointer" }}
              >
                {username}
              </span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* === Inline dropdown styles === */}
      <style>{`
        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: red;
          color: white;
          font-size: 10px;
          width: 18px;
          height: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }
        .notification-dropdown {
          position: absolute;
          right: 0;
          margin-top: 5px;
          width: 250px;
          max-height: 300px;
          overflow-y: auto;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          z-index: 9999;
        }
        .notification-item {
          padding: 8px 12px;
          border-bottom: 1px solid #eee;
          color: #333;
        }
        .notification-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
