import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' // Default role
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send registration request to the backend
      await axios.post('http://localhost:8080/public/create-user', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      // Redirect to login page after successful registration
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Registration failed');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen flex items-center justify-center py-8">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 font-bold text-2xl text-indigo-600">
            <div className="bg-indigo-600 text-white w-10 h-10 rounded-md flex items-center justify-center font-bold">Q</div>
            <span>QuizHub</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-6">Create your account</h1>
        
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-slate-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-indigo-600"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-slate-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-indigo-600"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-slate-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-indigo-600"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-slate-300 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-indigo-600"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-slate-300 mb-2" htmlFor="role">
              I am a:
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white focus:outline-none focus:border-indigo-600"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="STUDENT">STUDENT</option>
              <option value="EDUCATOR">EDUCATOR</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 rounded-md text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-500 hover:text-indigo-400">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;