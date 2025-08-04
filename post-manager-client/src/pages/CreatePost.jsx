import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('thumbnail', thumbnail);

    await axios.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    navigate('/');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Title" className="w-full p-2 border" onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Content" className="w-full p-2 border" onChange={e => setContent(e.target.value)} />
        <input type="text" placeholder="Category" className="w-full p-2 border" onChange={e => setCategory(e.target.value)} />
        <input type="file" className="w-full" onChange={e => setThumbnail(e.target.files[0])} />
        <button className="bg-purple-500 text-white px-4 py-2 rounded">Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
