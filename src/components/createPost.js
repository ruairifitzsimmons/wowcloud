import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/forum.module.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.createPostContainer}>
        <h2 className={styles.createPostHeader}>Create a post</h2>
        <input className={styles.postInput} type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea className={styles.postInput} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content"></textarea>
        <select className={styles.postSelect} required value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map((category) => (
            <option key={category._id} value={category._id}>
                {category.name}
            </option>
            ))}
        </select>
        <button className={styles.postButton} onClick={createPost}>Create Post</button>
    </div>
  );
};

export default CreatePost;