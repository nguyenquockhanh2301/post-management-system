// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PostList from './pages/PostList';
import CreatePost from './pages/CreatePost';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Default route goes to posts list */}
        <Route path="/" element={token ? <PostList /> : <Navigate to="/login" />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Create post protected */}
        <Route
          path="/create"
          element={token ? <CreatePost /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
