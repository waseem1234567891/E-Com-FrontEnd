import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import './Login.css'; // Import the CSS file

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthService.login(formData.username, formData.password);
            setMessage(`Welcome, ${response.data.username}!`);
        } catch (error) {
            setMessage('Login failed. Check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <CardContent>
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

export default Login;
