import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:9000/forum/posts');
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:9000/forum/categories');
      setCategories(response.data);
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
        'http://localhost:9000/forum/posts',
        { title, content, category: selectedCategory },
        { headers: { Authorization: token } }
      );
      setTitle('');
      setContent('');
      setSelectedCategory('');
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category._id === categoryId);
    return category ? category.name : '';
  };

  return (
    <div>
      <h1>Forum</h1>
      <div>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content"></textarea>
        <select required value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <button onClick={createPost}>Create Post</button>
      </div>
      <div>
        {posts.map((post) => (
          <div key={post._id}>
            <h2>{post.title}</h2>
            <p>{getCategoryName(post.category)}</p>
            <p>{post.content}</p>
            <p>by {post.author.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumPosts;
