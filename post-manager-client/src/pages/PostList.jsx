// src/pages/PostList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// prefer VITE_API_URL or fallback to Railway domain
const API_URL = import.meta.env.VITE_API_URL || 'https://post-management-system-production.up.railway.app';

const PostList = () => {
  const [posts, setPosts] = useState(null); // null => loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/posts`;

    axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => setPosts(res.data || []))
      .catch(err => {
        console.error('Failed to fetch posts', err);
        setError(err);
        setPosts([]); // show empty
      });
  }, []);

  const thumbnailUrl = (thumbnailPath) => {
    if (!thumbnailPath) return '';
    if (/^https?:\/\//i.test(thumbnailPath)) return thumbnailPath;
    const cleaned = thumbnailPath.replace(/^\/+/, '');
    return `${API_URL}/${cleaned}`;
  };

  if (posts === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading posts…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">All Posts</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
            Failed to load posts.
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center text-gray-600">No posts yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <article key={post._id} className="bg-white rounded-lg shadow overflow-hidden">
                {post.thumbnail && (
                  <img
                    src={thumbnailUrl(post.thumbnail)}
                    alt={post.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}

                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">{post.category}</p>
                  <p className="text-gray-700 text-sm line-clamp-3">{post.content}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;
