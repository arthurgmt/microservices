// src/component/Login.js
import React, { useState } from 'react';
import { useAuth } from './AuthContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        login(data.token);
        setNotification("Connected");
      } else if (response.status === 401) {
        setNotification("Invalid Credentials");
      } else {
        setNotification("Une erreur inattendue s'est produite");
      }

      setTimeout(() => {
        setNotification(null);
      }, 3000);

    } catch (error) {
      console.error(error);
      setNotification("Erreur réseau");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {notification && (
        <div
          className="notification"
          style={{
            position: "fixed",
            bottom: "1.5%",
            right: "0%",
            transform: "translateX(-20%)",
            zIndex: 1000,
          }}
        >
          {notification}
        </div>
      )}
    </div>
  );
};

export default Login;
