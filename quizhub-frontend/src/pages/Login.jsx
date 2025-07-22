import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Login request
      const response = await axios.post('http://localhost:8080/public/login', {
        username,
        password
      });

      console.log('Full login response:', response);
      console.log('Response data:', response.data);
      console.log('Response headers:', response.headers);
      
      // Check for token in headers
      const authHeader = response.headers['authorization'] || response.headers['Authorization'];
      let token = null;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('Token found in headers');
      } else if (response.data) {
        if (typeof response.data === 'object') {
          console.log('Response data properties:', Object.keys(response.data));
          token = response.data.token || 
                  response.data.accessToken || 
                  response.data.access_token || 
                  response.data.jwtToken || 
                  response.data.jwt;
        } else if (typeof response.data === 'string') {
          token = response.data;
          console.log('Response is string, using as token');
        }
      }
      
      if (!token) {
        console.error('Could not find token in response. Please check console logs for response structure.');
        setError('Authentication successful but token not found. Check console for details.');
        setIsLoading(false);
        return;
      }

      console.log('Token successfully extracted:', token.substring(0, 20) + '...');

      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      // Use the username returned by backend, if available
      const returnedUsername = response.data.username || username;
      localStorage.setItem('username', returnedUsername);

      // Store userId and role
      const userId = response.data.userId;
      const role = response.data.role;
      if (userId) {
        localStorage.setItem('userId', userId);
      } else {
        console.warn('UserId not found in response data.');
      }
      if (role) {
        localStorage.setItem('role', role);
      } else {
        console.warn('Role not found in response data.');
      }
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Redirect based on role
      if (role === 'STUDENT') {
        navigate('/student-dashboard');
      } else if (role === 'EDUCATOR') {
        navigate('/educator-dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        // Default redirect if role is unknown
        navigate('/student-dashboard');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      setError('Login failed: ' + (err.response?.data?.message || 'Invalid credentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
            <div className="bg-indigo-600 text-white w-10 h-10 rounded-md flex items-center justify-center font-bold">Q</div>
            <span>QuizHub</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Log in to your account</h1>
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-300 mb-2" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-indigo-600"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-slate-300 mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-indigo-600"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 rounded-md text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Don't have an account?{' '}
            <a href="/register" className="text-indigo-500 hover:text-indigo-400">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
