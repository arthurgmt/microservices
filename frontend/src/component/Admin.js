import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css'

function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:8000/api/users');
    setUsers(response.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8000/api/users/${id}`);
    fetchUsers();
  };

  const updateRole = async (id, newRole) => {
    await axios.put(`http://localhost:8000/api/users/${id}`, { role: newRole });
    fetchUsers();
  };

  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated || (!userRole ==='admin')) {
    return <Navigate to="/" />;
  }

  return (
    <div className='admin-container'>
      <h1 className='admin-title'>Admin Panel</h1>
      <table className='admin-table'>
        <thead className='admin-thread'>
          <tr className='admin-tr'>
            <th className='admin-text'>Email</th>
            <th className='admin-text'>Role</th>
            <th className='admin-text'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className='admin-tr'>
              <td className='admin-text'>{user.email}</td>
              <td className='admin-text'>
                <select value={user.role} onChange={e => updateRole(user.id, e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </td>
              <td className='admin-text'>
                <button onClick={() => deleteUser(user.id) } className='admin-button'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
