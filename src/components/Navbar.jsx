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

  // 🧮 Update unread count
  useEffect(() => {
    if (!dropdownOpen) setUnreadCount(notifications.length);
  }, [notifications, dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate(role === "ADMIN" ? "/admin-login" : "/login");
  };

  const handleUserClick = () => {
    navigate(role === "ADMIN" ? "/admin-dashboard" : "/dashboard");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    if (!dropdownOpen) setUnreadCount(0);
  };

  // 🧠 Separate notifications by source
  const adminNotifs = notifications.filter((n) => n.from === "admin");
  const userNotifs = notifications.filter((n) => n.from !== "admin");

  const sortedNotifications = [...notifications].sort((a, b) => b.id - a.id);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ==== LEFT LINKS ==== */}
        <div className="navbar-links">
          <Link
            to={role === "ADMIN" ? "/admin-dashboard" : "/"}
            className="navbar-link"
          >
            Home
          </Link>

          {role !== "ADMIN" && (
            <Link to="/register" className="navbar-link">
              Register
            </Link>
          )}

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
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {dropdownOpen && (
                <div
                  key={notifications.map((n) => n.id).join("-")}
                  className="notification-dropdown"
                >
                  {sortedNotifications.length === 0 ? (
                    <p className="text-gray-500 p-2">No notifications</p>
                  ) : (
                    <ul>
                      {sortedNotifications.slice(0, 6).map((n) => (
                        <li
                          key={n.id}
                          className={`notification-item ${n.type || ""}`}
                          style={{
                            backgroundColor:
                              n.from === "admin" ? "#fff7e6" : "white",
                            borderLeft:
                              n.from === "admin"
                                ? "4px solid #ff9800"
                                : "4px solid #2196f3",
                          }}
                        >
                          {n.link ? (
                            n.link.startsWith("http") ? (
                              <a
                                href={n.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="notification-link"
                                onClick={() => setDropdownOpen(false)}
                              >
                                {n.from === "admin" && (
                                  <strong>[ADMIN] </strong>
                                )}
                                {n.message}
                              </a>
                            ) : (
                              <Link
                                to={n.link}
                                className="notification-link"
                                onClick={() => setDropdownOpen(false)}
                              >
                                {n.from === "admin" && (
                                  <strong>[ADMIN] </strong>
                                )}
                                {n.message}
                              </Link>
                            )
                          ) : (
                            <span>
                              {n.from === "admin" && <strong>[ADMIN] </strong>}
                              {n.message}
                            </span>
                          )}
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

      {/* === Inline Styles === */}
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
          width: 270px;
          max-height: 300px;
          overflow-y: auto;
          background: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          z-index: 9999;
        }
        .notification-item {
          padding: 8px 10px;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }
        .notification-item:last-child {
          border-bottom: none;
        }
        .notification-link {
          text-decoration: none;
          color: inherit;
        }
        .notification-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
