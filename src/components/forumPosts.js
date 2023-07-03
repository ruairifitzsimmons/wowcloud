import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePost from './createPost';
import Post from './post';
import styles from '../styles/forum.module.css';

const ForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category._id === categoryId);
    return category ? category.name : '';
  };

  return (
    <div className={styles.forumOuter}>
      <div className={styles.forumContainer}>
        <div className={styles.forumLeft}>
          <div className={styles.postsContainer}>
            {posts.map((post) => (
              <Post key={post._id} post={post} categoryName={getCategoryName(post.category)}/>
            ))}
          </div>
        </div>
        <div className={styles.forumRight}>
          <CreatePost/>
        </div>
      </div>
    </div>
  );
};

export default ForumPosts;