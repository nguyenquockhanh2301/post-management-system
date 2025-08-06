import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://post-management-system-production.up.railway.app';

// Helper for correct image URL
function thumbnailUrl(thumbnailPath) {
  if (!thumbnailPath) return '';
  if (/^https?:\/\//i.test(thumbnailPath)) {
    return thumbnailPath;
  }
  return `${API_URL}/${thumbnailPath.replace(/^\/+/, '')}`;
}

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  // Fetch single post
  useEffect(() => {
    axios
      .get(`${API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => setPost(res.data))
      .catch((err) => console.error('Error fetching post', err));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/');
    } catch (err) {
      console.error('Error deleting post', err);
      alert('Failed to delete post');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const title = prompt('Enter new title', post.title);
    const content = prompt('Enter new content', post.content);
    const category = prompt('Enter new category', post.category);

    if (title && content && category) {
      try {
        const res = await axios.put(
          `${API_URL}/posts/${id}`,
          { title, content, category },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setPost(res.data);
      } catch (err) {
        console.error('Error updating post', err);
        alert('Failed to update post');
      }
    }
  };

  if (!post) {
    return <p className="text-center mt-10">Loading post...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {post.thumbnail && (
        <img
          src={thumbnailUrl(post.thumbnail)}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{post.category}</p>
      <p className="text-gray-800 mb-6">{post.content}</p>

      <div className="flex gap-4">
        <button
          onClick={handleEdit}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
        <Link
          to="/"
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Back
        </Link>
      </div>
    </div>
  );
};

export default PostDetail;
