import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Header.css';
import Login from './Login';
import Logout from './Logout';

const Header = () => {
  const { isAuthenticated, userRole, getUser } = useAuth();
  const user = getUser();

  return (
    <header className="header">
      <nav className="nav">
        {!isAuthenticated && (
          <>
            <NavLink to="/" activeclassname="active">
              Accueil
            </NavLink>
            <NavLink to="/signin" activeclassname="active">
              Signin
            </NavLink>
            <Login />
          </>
        )}

        {isAuthenticated && (userRole === 'user' || userRole === 'utilisateur')&& (
          <>
            <NavLink to="/" activeclassname="active">
              Accueil
            </NavLink>
            <NavLink to="/upload" activeclassname="active">
              FileGestion
            </NavLink>
            <Logout />
            <p className='name'>{user}</p>
          </>
        )}

        {isAuthenticated && userRole === 'admin' && (
          <>
            <NavLink to="/" activeclassname="active">
              Accueil
            </NavLink>
            <NavLink to="/snakegame" activeclassname="active">
              SnakeGame
            </NavLink>
            <NavLink to="/upload" activeclassname="active">
              FileGestion
            </NavLink>
            <NavLink to="/admin" activeclassname="active">
              Admin Panel
            </NavLink>
            <Logout />
            <p className='name'>{user}</p>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
