// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PostList from './pages/PostList';
import CreatePost from './pages/CreatePost';
import Navbar from './components/Navbar';

// Simple helper to check auth
const isLoggedIn = () => !!localStorage.getItem('token');

const App = () => {
  return (
    <Router>
      {/* Navbar always rendered; it will show different items depending on auth */}
      <Navbar />

      <Routes>
        {/* If user is logged in show PostList at / else redirect to /login */}
        <Route path="/" element={isLoggedIn() ? <PostList /> : <Navigate to="/login" replace />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Create protected */}
        <Route path="/create" element={isLoggedIn() ? <CreatePost /> : <Navigate to="/login" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
