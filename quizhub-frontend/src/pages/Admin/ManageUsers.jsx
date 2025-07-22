import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For back button navigation

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/all-users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token');

    // Show confirmation alert before deleting
    const confirmDelete = window.confirm(`Are you sure you want to delete user with ID ${userId}?`);
    if (!confirmDelete) return; // Stop if user cancels

    try {
      await axios.delete(`http://localhost:8080/admin/delete-user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Remove the deleted user from the state
      setUsers(users.filter(user => user.id !== userId));

      alert(`User with ID ${userId} deleted successfully!`); // Show success alert
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center">
        <div className="text-2xl">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <button 
            onClick={() => navigate(-1)} // Go back to the previous page
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            Back
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Created At</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`
                      px-2 py-1 rounded text-sm
                      ${user.role === 'ADMIN' ? 'bg-red-600/20 text-red-400' : 
                        user.role === 'EDUCATOR' ? 'bg-blue-600/20 text-blue-400' : 
                        'bg-green-600/20 text-green-400'}
                    `}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
