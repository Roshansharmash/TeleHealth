
import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-telehealth-primary to-telehealth-secondary bg-clip-text text-transparent">
            TeleHealth Connect
          </h1>
          <p className="mt-3 text-gray-500">
            Access quality healthcare from anywhere
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
