import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import './Register.css'; // Import custom CSS

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await AuthService.register(formData.username, formData.password, formData.email);
            setMessage('Registration successful!');
        } catch (error) {
            setMessage('Registration failed. Try again.');
        }
    };

    return (
        <div className="register-container">
            <Card className="register-card">
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="register-input"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="register-input"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="register-input"
                        />
                        <Button type="submit" className="register-button">Register</Button>
                        {message && <p className="register-message">{message}</p>}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;
