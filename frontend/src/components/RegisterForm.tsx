import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authService from '../services/authService';
import { registerSuccess, setError, setLoading } from '../store/authSlice';

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    dispatch(setLoading(true));

    try {
      const res = await authService.register(form);
      dispatch(registerSuccess(res));
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ marginBottom: '1rem' }}>
        <label>Username:</label>
        <input name="username" value={form.username} onChange={onChange} required />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Email:</label>
        <input type="email" name="email" value={form.email} onChange={onChange} required />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>First Name:</label>
        <input name="firstName" value={form.firstName} onChange={onChange} required />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Last Name:</label>
        <input name="lastName" value={form.lastName} onChange={onChange} required />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Password:</label>
        <input type="password" name="password" value={form.password} onChange={onChange} required />
      </div>

      <button type="submit" style={{ width: '100%', padding: '0.75rem' }}>Create Account</button>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </form>
  );
};

export default RegisterForm;
