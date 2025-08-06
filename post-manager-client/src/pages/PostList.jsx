// src/pages/PostList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://post-management-system-production.up.railway.app';

// Helper to build thumbnail URL
function thumbnailUrl(thumbnailPath) {
  if (!thumbnailPath) return '';
  if (/^https?:\/\//i.test(thumbnailPath)) {
    return thumbnailPath;
  }
  return `${API_URL}/${thumbnailPath.replace(/^\/+/, '')}`;
}

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Failed to fetch posts', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">All Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <article
              key={post._id}
              className="bg-white border rounded shadow hover:shadow-lg transition overflow-hidden"
            >
              <Link to={`/posts/${post._id}`}>
                {post.thumbnail && (
                  <img
                    src={thumbnailUrl(post.thumbnail)}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
              </Link>
              <div className="p-4">
                <Link to={`/posts/${post._id}`}>
                  <h2 className="text-xl font-semibold mb-1 hover:underline">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-500 mb-2">{post.category}</p>
                <p className="text-gray-700 line-clamp-3">
                  {post.content?.slice(0, 100)}...
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostList;
