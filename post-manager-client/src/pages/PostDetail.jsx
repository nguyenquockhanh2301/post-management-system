// src/pages/PostDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// API base (uses Vite env or fallback)
const API_URL = import.meta.env.VITE_API_URL || 'https://post-management-system-production.up.railway.app';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/posts/${id}`, { headers: authHeaders() });
        setPost(res.data);
        setTitle(res.data.title || '');
        setContent(res.data.content || '');
        setCategory(res.data.category || '');
      } catch (err) {
        console.error('Failed to load post', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Submit edit (multipart if thumbnail)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // If thumbnail file selected, send FormData
      if (thumbnailFile) {
        const form = new FormData();
        form.append('title', title);
        form.append('content', content);
        form.append('category', category);
        form.append('thumbnail', thumbnailFile);

        await axios.put(`${API_URL}/posts/${id}`, form, {
          headers: {
            ...authHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // JSON update
        await axios.put(`${API_URL}/posts/${id}`, { title, content, category }, {
          headers: {
            ...authHeaders(),
            'Content-Type': 'application/json',
          },
        });
      }

      // Refresh post data
      const res = await axios.get(`${API_URL}/posts/${id}`, { headers: authHeaders() });
      setPost(res.data);
      setEditing(false);
    } catch (err) {
      console.error('Update failed', err);
      setError(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/posts/${id}`, { headers: authHeaders() });
      // after deletion go back home
      navigate('/');
    } catch (err) {
      console.error('Delete failed', err);
      setError(err?.response?.data?.message || 'Delete failed');
    }
  };

  if (loading && !post) return <div className="p-4">Loading...</div>;
  if (error && !post) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
        <div className="flex items-start gap-4">
          {post?.thumbnail && (
            <img
              src={/^https?:\/\//i.test(post.thumbnail) ? post.thumbnail : `${API_URL}/${post.thumbnail.replace(/^\/+/, '')}`}
              alt={post.title}
              className="w-40 h-40 object-cover rounded"
            />
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-2">{post.category}</p>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>

        <hr className="my-6" />

        {/* Controls */}
        {!editing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>

            <button
              onClick={() => navigate('/')}
              className="ml-auto text-gray-600 hover:underline"
            >
              Back
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input className="w-full p-2 border rounded" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-medium">Content</label>
              <textarea className="w-full p-2 border rounded" value={content} onChange={e => setContent(e.target.value)} rows={6} required />
            </div>

            <div>
              <label className="block text-sm font-medium">Category</label>
              <input className="w-full p-2 border rounded" value={category} onChange={e => setCategory(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium">Replace thumbnail (optional)</label>
              <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files[0])} />
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded">
                Save
              </button>

              <button type="button" onClick={() => setEditing(false)} className="border px-3 py-1 rounded">
                Cancel
              </button>
            </div>

            {error && <p className="text-red-600">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
