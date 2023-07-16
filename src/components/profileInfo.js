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
  const [likedPosts, setLikedPosts] = useState([]);
  const [myPostsPage, setMyPostsPage] = useState(1);
  const [myPostsPerPage, setMyPostsPerPage] = useState(3);
  const [likedPostsPage, setLikedPostsPage] = useState(1);
  const [likedPostsPerPage, setLikedPostsPerPage] = useState(3);

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
    fetchLikedPosts();
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
            }))
          );
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

  const fetchLikedPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:9000/forum/posts/liked', {
          headers: {
            Authorization: token,
          },
        });
        setLikedPosts(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle user not authenticated
        return;
      }

      await axios.post(
        `http://localhost:9000/forum/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: token },
        }
      );

      // Refetch the liked posts after liking/unliking a post
      fetchLikedPosts();
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleMyPostsPageChange = (newPage) => {
    setMyPostsPage(newPage);
  };

  const handleLikedPostsPageChange = (newPage) => {
    setLikedPostsPage(newPage);
  };

  const paginateArray = (array, page, perPage) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return array.slice(startIndex, endIndex);
  };

  const paginatedMyPosts = paginateArray(posts, myPostsPage, myPostsPerPage);
  const paginatedLikedPosts = paginateArray(likedPosts, likedPostsPage, likedPostsPerPage);

  const maxMyPostsPage = Math.ceil(posts.length / myPostsPerPage);
  const maxLikedPostsPage = Math.ceil(likedPosts.length / likedPostsPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.postsContainer}>
          <div className={styles.postContainer}>
            <h2 className={styles.h2Header}>My Posts</h2>
            {paginatedMyPosts.map((post) => (
              <Post
                key={post._id}
                post={post}
                categoryName={getCategoryName(post.category)}
                loggedInUser={loggedInUser}
                updatePost={updatePost}
                deletePost={deletePost}
              />
            ))}
            {posts.length > 0 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handleMyPostsPageChange(myPostsPage - 1)}
                  disabled={myPostsPage === 1}
                >
                  Previous
                </button>
                <button
                  onClick={() => handleMyPostsPageChange(myPostsPage + 1)}
                  disabled={myPostsPage === maxMyPostsPage}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          {likedPosts.length > 0 && (
            <div className={styles.postContainer}>
              <h2 className={styles.h2Header}>Liked Posts</h2>
              {paginatedLikedPosts.map((post) => (
                <Post
                  key={post._id}
                  post={post}
                  categoryName={getCategoryName(post.category)}
                  loggedInUser={loggedInUser}
                  updatePost={updatePost}
                  deletePost={deletePost}
                />
              ))}
              {likedPosts.length > 0 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => handleLikedPostsPageChange(likedPostsPage - 1)}
                    disabled={likedPostsPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleLikedPostsPageChange(likedPostsPage + 1)}
                    disabled={likedPostsPage === maxLikedPostsPage}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          {editing ? (
            <div className={styles.profileInfoContainer}>
              <div className={styles.usernameContainer}>
                <input
                  className={styles.usernameField}
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <div className={styles.buttonContainer}>
                  <button className={styles.cancelButton} onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className={styles.saveButton} onClick={handleSave}>
                    Save
                  </button>
                </div>
              </div>
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
