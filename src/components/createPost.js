import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/forum.module.css';
import giphyImage from '../images/giphy.png';
import Image from 'next/image';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [giphyLink, setGiphyLink] = useState('');

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
  
      if (!giphyLink.includes('giphy.gif')) {
        // Display an error message or handle the invalid link
        console.log('Invalid GIPHY link');
        return;
      }
  
      await axios.post(
        'http://localhost:9000/forum/posts',
        { title, content, category: selectedCategory, giphyLink },
        { headers: { Authorization: token } }
      );
      setTitle('');
      setContent('');
      setSelectedCategory('');
      setGiphyLink('');
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className={styles.createPostContainer}>
      <h2 className={styles.createPostHeader}>Create a post</h2>
      <input
        className={styles.postInput}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        className={styles.postInput}
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      ></textarea>
      <select
        className={styles.postSelect}
        required
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <div className={styles.giphyLinkContainer}>
        <a href="https://giphy.com/search/World-of-Warcraft" target="_blank" rel="noopener noreferrer">
          <Image src={giphyImage} alt="Giphy" className={styles.giphyIcon}/>
        </a>
        <input
          className={styles.postInput}
          type="text"
          value={giphyLink}
          onChange={(e) => setGiphyLink(e.target.value)}
          placeholder="GIPHY Link"
        />
      </div>
      <button className={styles.postButton} onClick={createPost}>
        Create Post
      </button>
    </div>
  );
};

export default CreatePost;