// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Navbar shows links and a Logout button when the user is logged in.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token'); // clear stored JWT
    navigate('/login');               // redirect to login
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-gray-800">Post Manager</Link>
        </div>

        <nav className="flex items-center gap-3">
          {token ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
              <Link to="/create" className="text-gray-700 hover:text-gray-900">Create</Link>
              <button
                onClick={handleLogout}
                className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-gray-900">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
