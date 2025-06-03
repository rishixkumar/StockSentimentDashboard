import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract token from URL parameters
  const token = new URLSearchParams(location.search).get('token');
  
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.post('http://localhost:8000/auth/reset-password', {
        token: token,
        password: password
      });
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError('Failed to reset password. Token may be expired or invalid.');
    }
    
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Invalid Reset Link</h2>
          <div className="auth-error">
            This password reset link is invalid or has expired.
          </div>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Password Reset Successful!</h2>
          <div className="auth-success">
            Your password has been successfully reset. You will be redirected to login in a few seconds.
          </div>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/login')}
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Reset Your Password</h2>
        
        <label>New Password</label>
        <input
          type="password"
          value={password}
          required
          minLength={6}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
        
        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          required
          minLength={6}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
        
        {error && <div className="auth-error">{error}</div>}
        
        <button 
          className="btn-primary" 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        
        <div className="auth-switch">
          <button type="button" onClick={() => navigate('/login')}>
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}
