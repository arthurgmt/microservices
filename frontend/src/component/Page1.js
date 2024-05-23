// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Page1.css';

function Page1() {
  return (
    <div className='home-container'>
      <h1>Welcome to Boubou File Gestion</h1>
      <div className='feature'>
        <h2>User Authentication</h2>
        <p>Users can register, login, and logout from their account. Each user can have either an 'admin' or 'user' role.</p>
      </div>
      <div className='feature'>
        <h2>File Upload</h2>
        <p>Users can drag and drop or select files from their device to upload them to the server. Files are then listed and can be downloaded or deleted.</p>
      </div>
      <div className='feature'>
        <h2>Admin Panel</h2>
        <p>Administrators can view all users, change their roles, or delete users.</p>
      </div>
      <div className='feature'>
        <h2>Document Search</h2>
        <p>Users can search for their uploaded documents by filename.</p>
      </div>
      <div className='navigation'>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/admin">Admin Panel</Link>
        <Link to="/upload">File Upload</Link>
      </div>
    </div>
  );
}

export default Page1;
