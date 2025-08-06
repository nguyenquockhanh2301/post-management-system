import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('token'); navigate('/login'); };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">Post Manager</Link>
        <nav>
          {token ? (
            <>
              <Link to="/" className="mr-3">Home</Link>
              <Link to="/create" className="mr-3">Create</Link>
              <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-3">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
