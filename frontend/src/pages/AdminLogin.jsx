import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { API_URL } from '../config';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting admin login with:', formData);
      console.log('🌐 Making request to:', `${API_URL}/api/admin/login`);
      
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📄 Response data:', data);
      console.log('🔑 Token present:', !!data.token);
      console.log('👤 Admin data present:', !!data.admin);

      if (response.ok && data.token) {
        console.log('✅ Login successful, storing token...');
        // Store admin token
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        
        console.log('🔄 Redirecting to admin dashboard...');
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        console.log('❌ Login failed:', data.message || 'Invalid login or password');
        setError(data.message || 'Invalid login or password');
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error stack:', error.stack);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>RTX Cinema</h1>
          <h2>Admin Panel</h2>
          <p>Administrator Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In to Admin Panel'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Secure Admin Access</p>
          <button 
            onClick={() => navigate('/')}
            className="back-to-site-btn"
          >
            ← Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;