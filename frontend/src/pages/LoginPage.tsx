import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/AuthPage.css';

const LoginPage: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
