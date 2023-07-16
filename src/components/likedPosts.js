import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './post';

const LikedPosts = ({ loggedInUser }) => {
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    fetchLikedPosts();
  }, []);

  const fetchLikedPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle user not authenticated
        return;
      }

      const response = await axios.get(
        'http://localhost:9000/forum/posts/liked',
        {
          headers: { Authorization: token },
        }
      );
      const likedPostsData = response.data;
      setLikedPosts(likedPostsData);
    } catch (error) {
      console.error('Error fetching liked posts:', error);
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

  return (
    <div>
      <h2>Liked Posts</h2>
      {likedPosts.length > 0 ? (
        likedPosts.map((post) => (
          <Post
            key={post._id}
            post={post}
            loggedInUser={loggedInUser}
          />
        ))
      ) : (
        <p>No liked posts found.</p>
      )}
    </div>
  );
};

export default LikedPosts;
