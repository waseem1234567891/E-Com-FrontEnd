import React, { useState, useContext } from 'react';
import AuthService from '../../services/AuthService';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/-AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(formData.username, formData.password);
      login(response.data.userName, response.data.userId, response.data.token);
      navigate('/');
    } catch (error) {
      if (error.response?.data?.status === 400) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Username or Password Incorrect');
      }
    }
  };

  return (
    <div className="login-container">
      {/* Inline CSS */}
      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f3f4f6;
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
        }
        .login-input {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
        }
        .login-button {
          width: 100%;
          background-color: #3b82f6;
          color: white;
          padding: 0.75rem;
          font-size: 1rem;
          border-radius: 0.375rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .login-button:hover {
          background-color: #2563eb;
        }
        .login-message {
          color: red;
          margin-top: 0.5rem;
          text-align: center;
        }
        .forgot-button {
          width: 100%;
          margin-top: 1rem;
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .forgot-button:hover {
          background-color: #e5e7eb;
        }
      `}</style>

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

          {/* Single Forgot Account Details Button */}
          <Link to="/forget-username-password">
            <Button className="forgot-button">
              Forgot Username or Password?
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
