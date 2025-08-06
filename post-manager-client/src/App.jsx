// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PostList from './pages/PostList';
import CreatePost from './pages/CreatePost';
import Navbar from './components/Navbar';
import PostDetail from './pages/PostDetail';


// Simple helper to check auth
const isLoggedIn = () => !!localStorage.getItem('token');

const App = () => {
  const token = localStorage.getItem('token');
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={token ? <PostList /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={token ? <CreatePost /> : <Navigate to="/login" />} />
        <Route path="/posts/:id" element={isLoggedIn() ? <PostDetail /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
