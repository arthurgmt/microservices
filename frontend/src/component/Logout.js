// src/component/Logout.js
import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return <button onClick={handleLogout}>Déconnexion</button>;
};

export default Logout;
