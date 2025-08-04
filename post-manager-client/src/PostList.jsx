import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/posts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => setPosts(res.data))
    .catch(() => setPosts([]));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <div key={post._id} className="border p-4 rounded">
            <img src={`/${post.thumbnail}`} alt="thumbnail" className="w-full h-48 object-cover mb-2" />
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm">{post.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;