import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPasswordPage({ onBack }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:8000/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('Failed to send reset email. Please check your address.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <label>Email</label>
        <input
          type="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
        />
        {error && <div className="auth-error">{error}</div>}
        {sent ? (
          <div className="auth-success">
            If your email is registered, you will receive a password reset link.
          </div>
        ) : (
          <button className="btn-primary" type="submit">Send Reset Link</button>
        )}
        <div className="auth-switch">
          <button type="button" onClick={onBack}>Back to Login</button>
        </div>
      </form>
    </div>
  );
}
