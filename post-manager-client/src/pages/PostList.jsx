// src/pages/PostList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

// Prefer VITE_API_URL from .env. If not provided, fall back to your deployed backend URL.
// - When developing, set VITE_API_URL in post-manager-client/.env and restart the dev server.
// - Example .env: VITE_API_URL=https://post-management-system-production.up.railway.app
const API_URL = import.meta.env.VITE_API_URL || "https://post-management-system-production.up.railway.app";

const PostList = () => {
  const [posts, setPosts] = useState(null); // null = loading, [] = loaded but empty
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Build request URL:
    // - If API_URL is set, we use absolute URL so images served by backend are resolvable.
    // - This works both in dev (when you set VITE_API_URL) and production.
    const url = `${API_URL}/posts`;

    axios
      .get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        // optional: set a short timeout so the UI doesn't hang too long
        timeout: 8000,
      })
      .then((res) => {
        setPosts(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
        setError(err);
        setPosts([]); // show empty state instead of null
      });
  }, []);

  // Build a full absolute URL for a stored thumbnail path.
  // Accepts:
  //  - a full URL (returns as-is)
  //  - a path like "uploads/xxx.jpg" or "/uploads/xxx.jpg" -> returns `${API_URL}/uploads/xxx.jpg`
  const thumbnailUrl = (thumbnailPath) => {
    if (!thumbnailPath) return "";
    // If it's already an absolute URL, return it directly
    if (/^https?:\/\//i.test(thumbnailPath)) return thumbnailPath;
    // Remove leading slashes to avoid double slashes after join
    const cleaned = thumbnailPath.replace(/^\/+/, "");
    return `${API_URL}/${cleaned}`;
  };

  // Small UI states
  if (posts === null) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Posts</h1>
        <p>Loading posts…</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>

      {error && (
        <div className="mb-4 p-3 border rounded bg-red-50 text-red-700">
          Failed to load posts. Check console for details.
        </div>
      )}

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="border p-4 rounded">
              {/* Render image only if thumbnail exists */}
              {post.thumbnail ? (
                <img
                  src={thumbnailUrl(post.thumbnail)}
                  alt={post.title || "thumbnail"}
                  className="w-full h-48 object-cover mb-2"
                  // If the image fails to load, hide it gracefully
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}

              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-600">{post.category}</p>
              {/* Optionally show author/createdAt if you want */}
              {/* <p className="text-xs text-gray-500">By {post.author} • {new Date(post.createdAt).toLocaleString()}</p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
