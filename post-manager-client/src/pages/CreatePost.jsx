// src/pages/CreatePost.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://post-management-system-production.up.railway.app';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnail) return alert('Please select a thumbnail image');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('thumbnail', thumbnail);

    try {
      await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-lg w-full bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Create Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <textarea className="w-full p-2 border rounded" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} required />
          <input className="w-full p-2 border rounded" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
          <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files[0])} />
          <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded">
            {loading ? 'Posting...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
