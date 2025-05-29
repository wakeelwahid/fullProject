
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AuthGuard.css';

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const publicRoutes = ['/', '/login', '/register', '/privacy', '/terms', '/refund', '/game-rules'];
  
  const isPublicRoute = publicRoutes.includes(location.pathname);

  useEffect(() => {
    if (!isPublicRoute && !isAuthenticated()) {
      setShowLoginPrompt(true);
    }
  }, [location.pathname, isPublicRoute]);

  const handleLoginRedirect = () => {
    navigate('/login');
    setShowLoginPrompt(false);
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
    setShowLoginPrompt(false);
  };

  const handleGoHome = () => {
    navigate('/');
    setShowLoginPrompt(false);
  };

  if (!isPublicRoute && !isAuthenticated()) {
    return (
      <div className="auth-guard-overlay">
        <div className="auth-guard-popup">
          <div className="popup-icon">
            <i className="fas fa-lock"></i>
          </div>
          <h2>Authentication Required</h2>
          <p>You need to login or register to access this page.</p>
          <div className="auth-buttons">
            <button className="home-btn" onClick={handleGoHome}>
              <i className="fas fa-home"></i> Go Home
            </button>
            <button className="login-btn" onClick={handleLoginRedirect}>
              <i className="fas fa-sign-in-alt"></i> Login
            </button>
            <button className="register-btn" onClick={handleRegisterRedirect}>
              <i className="fas fa-user-plus"></i> Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;
