import React from 'react';
import RegisterForm from '../components/RegisterForm';
import '../styles/AuthPage.css';

const RegisterPage: React.FC = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
