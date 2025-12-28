import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Mission Control</h1>
        <p className="text-secondary">Welcome back, <span className="username">{user?.username}</span></p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card card" onClick={() => navigate('/projects')}>
          <div className="card-icon">📁</div>
          <h3>My Projects</h3>
          <p className="text-muted">Manage your projects and repositories</p>
        </div>

        <div className="dashboard-card card" onClick={() => navigate('/explore')}>
          <div className="card-icon">🌐</div>
          <h3>Explore</h3>
          <p className="text-muted">Discover public projects</p>
        </div>

        <div className="dashboard-card card">
          <div className="card-icon">👤</div>
          <h3>Profile</h3>
          <div className="profile-info">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        </div>

        <div className="dashboard-card card logout-card" onClick={handleLogout}>
          <div className="card-icon">🚪</div>
          <h3>Logout</h3>
          <p className="text-muted">Sign out of your account</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
