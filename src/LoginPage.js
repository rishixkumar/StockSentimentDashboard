import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onSwitch, onForgot }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/'); // Redirect to dashboard/home after successful login
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <label>Email</label>
        <input
          type="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="auth-error">{error}</div>}
        <button className="btn-primary" type="submit">Login</button>
        <div className="auth-switch">
            <button type="button" onClick={onForgot}>Forgot Password?</button>
        </div>

        <div className="auth-switch">
          <span>Don't have an account?</span>
          <button type="button" onClick={onSwitch}>Sign Up</button>
        </div>
      </form>
    </div>
  );
}
