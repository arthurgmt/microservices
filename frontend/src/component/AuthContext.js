// src/contexts/AuthContext.js
import { createContext, useContext, useState } from 'react';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('visiteur');
  const [user, setUser] = useState('visiteur');


  const login = (token) => {
    console.log(token);
    localStorage.setItem('token', token);
    try {
      const decoded = jwt_decode(token);
      setIsAuthenticated(true);
      setUser(decoded.sub.name)
      setUserRole(decoded.sub.role)
    } catch (e) {
      localStorage.removeItem('token');
    }
  };

  const getUser = () => {
    return user;
  }

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    userRole,
    getUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
