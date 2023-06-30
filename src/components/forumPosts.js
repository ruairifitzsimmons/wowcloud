import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/forum/posts');
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle user not authenticated
        return;
      }
      await axios.post(
        'http://localhost:9000/api/forum/posts',
        { title, content },
        { headers: { Authorization: token } }
      );
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Forum</h1>
      <div>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content"></textarea>
        <button onClick={createPost}>Create Post</button>
      </div>
      <div>
        {posts.map(post => (
          <div key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>Author: {post.author.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPosts;