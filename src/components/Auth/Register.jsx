import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import '../css/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ 
    firstName: '', 
    lastName: '', 
    username: '', 
    email: '', 
    password: '' 
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name cannot be empty";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name cannot be empty";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username cannot be empty";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email cannot be empty";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password cannot be empty";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      await AuthService.register(
        formData.firstName,
        formData.lastName,
        formData.username,
        formData.password,
        formData.email
      );
      setMessage("✅ Registration successful!");
      setFormData({ firstName: '', lastName: '', username: '', email: '', password: '' });
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "❌ Registration failed");
      } else {
        setMessage("❌ Network Error");
      }
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card">
        <CardContent>
          <form onSubmit={handleSubmit} className="register-form">

            <div className="form-group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`register-input ${errors.firstName ? "input-error" : ""}`}
              />
              {errors.firstName && <p className="error-text">{errors.firstName}</p>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`register-input ${errors.lastName ? "input-error" : ""}`}
              />
              {errors.lastName && <p className="error-text">{errors.lastName}</p>}
            </div>

            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`register-input ${errors.username ? "input-error" : ""}`}
              />
              {errors.username && <p className="error-text">{errors.username}</p>}
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`register-input ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`register-input ${errors.password ? "input-error" : ""}`}
              />
              {errors.password && <p className="error-text">{errors.password}</p>}
            </div>

            <Button type="submit" className="register-button">Register</Button>
            
            {message && <p className="register-message">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
