import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';
import './Navbar.css'; // Import the CSS file
import { AuthContext } from '../context/-AuthContext';
import { useContext } from 'react';


const Navbar = () => {
    //const [username, setUsername] = useState(null);
    const { username,logout } = useContext(AuthContext);
    const navigate = useNavigate();

   

    const handleLogout = () => {
       // AuthService.logout();
        logout();
        navigate('/login');
    };

    const handleUserClick = () => {
        navigate('/dashboard');
        
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Left Side Links */}
                <div className="navbar-links">
                    <Link to="/" className="navbar-link">Home</Link>
                    <Link to="/register" className="navbar-link">Register</Link>
                    {!username && <Link to="/login" className="navbar-link">Login</Link>}
                </div>

                {/* Right Side */}
                <div className="navbar-right">
                    {username && (
                        <>
                            <span className="navbar-username" onClick={handleUserClick}>
                                {username}
                            </span>
                            <button onClick={handleLogout} className="logout-button">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
