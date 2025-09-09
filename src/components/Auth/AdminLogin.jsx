import React, { useContext, useState } from 'react';
import AuthService from '../../services/AuthService';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import '../css/Login.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/-AuthContext';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate=useNavigate();
    const {login} = useContext(AuthContext);
    const {token} = useContext(AuthContext)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.adminlogin(formData.username, formData.password);
           // localStorage.setItem("token", response.data.token);
            login(response.data.userName,response.data.userId,response.data.token)
            console.log(response.data.token)
            navigate('/admin-dashboard');
           // setMessage(`Welcome, ${response.data.username}!`);
        } catch (error) {
            setMessage('Login failed. Check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <CardContent>
                    <h2 className="login-heading">Admin Login</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="login-input"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="login-input"
                        />
                        <Button type="submit" className="login-button">Login</Button>
                        {message && <p className="login-message">{message}</p>}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;
