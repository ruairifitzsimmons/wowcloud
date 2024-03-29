import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePost from './createPost';
import Post from './post';
import ForumCategories from '../components/forumCategories';
import styles from '../styles/forum.module.css';

const ForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    checkLoggedInUser();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:9000/forum/posts?include=comments&populate=comments.author');
      setAllPosts(response.data);
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

  const checkLoggedInUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://localhost:9000/profile', {
          headers: {
            Authorization: token,
          },
        });
        const userData = response.data;
        setLoggedInUser(userData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((category) => category._id === categoryId);
    return category ? category.name : '';
  };

  const updatePost = async (postId, content) => {
    try {
      const token = localStorage.getItem('token');
      if (token && content) {
        const response = await axios.put(
          `http://localhost:9000/forum/posts/${postId}`,
          { content },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const updatedPost = response.data;
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedPost._id ? updatedPost : post
          )
        );
        return updatedPost;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`http://localhost:9000/forum/posts/${postId}`, {
          headers: {
            Authorization: token,
          },
        });
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      }
    } catch (error) {
      console.log(error);
    }
  };

    const handleCategoryClick = (categoryId) => {
    if (categoryId === null) {
      setPosts(allPosts);
    } else {
      const filteredPosts = allPosts.filter((post) => post.category === categoryId);
      setPosts(filteredPosts);
    }
  };
  

  return (
    <div className={styles.forumOuter}>
      <div className={styles.forumContainer}>
        <div className={styles.forumLeft}>
          <ForumCategories handleCategoryClick={handleCategoryClick} />
          <div className={styles.postsContainer}>
            {posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                categoryName={getCategoryName(post.category)}
                loggedInUser={loggedInUser}
                updatePost={updatePost}
                deletePost={deletePost}
              />
            ))}
          </div>
        </div>
        <div className={styles.forumRight}>
          <CreatePost />
        </div>
      </div>
    </div>
  );
};

export default ForumPosts;