import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogout = () => {
        AuthService.logout();
        setIsLoggedIn(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Left Side Links */}
                <div className="navbar-links">
                    <Link to="/" className="navbar-link">
                        Home
                    </Link>
                    <Link to="/register" className="navbar-link">
                        Register
                    </Link>
                    <Link to="/login" className="navbar-link">
                        Login
                    </Link>
                    <Link to="/addProduct" className="navbar-link">
                        AddProduct
                    </Link>
                </div>

                {/* Right Side (Logout Button) */}
                {isLoggedIn && (
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
