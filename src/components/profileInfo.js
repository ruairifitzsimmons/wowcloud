import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/profile.module.css';
import Post from './post';

const ProfileInfo = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [editing, setEditing] = useState(false);
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:9000/profile', {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          const userData = response.data;
          setUsername(userData.username);
          setEmail(userData.email);
          setLoggedInUser(userData);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      router.push('/login');
    }

    fetchPosts();
    fetchCategories();
  }, []);

  const handleEdit = () => {
    setEditing(true);
    setNewUsername(username);
  };

  const handleSave = () => {
    const token = localStorage.getItem('token');
    if (token && newUsername) {
      axios
        .put(
          'http://localhost:9000/profile',
          { username: newUsername },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((response) => {
          const updatedUsername = response.data.username;
          setUsername(updatedUsername);
          setEditing(false);
          window.location.reload();

          // Update author name for each post with the new username
          setPosts((prevPosts) =>
          prevPosts.map((post) => ({
            ...post,
            author: { ...post.author, username: updatedUsername },
          })));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setNewUsername('');
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:9000/user-posts', {
          headers: {
            Authorization: token,
          },
        });
        setPosts(response.data);
      }
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
        updatedPost.author = post.author;
        setPosts((prevPosts) =>
          prevPosts.map((post) => 
            post._id === updatedPost._id ? { ...post, content: updatedPost.content } : post
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
        // Refresh the posts list after deletion
        fetchPosts();
      }
    } catch (error) {
      console.log(error);
    }
  };
  


  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
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
        <div>
          {editing ? (
            <div>
              <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <div className={styles.profileInfoContainer}>
              <div className={styles.profileUsernameContainer}>
              <span className={styles.profileInfoUsername}>Hello, {username}</span>
                <button className={styles.profileEditButton} onClick={handleEdit}>
                  Change
                </button>
              </div>
              <span className={styles.profileInfoEmail}>{email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;