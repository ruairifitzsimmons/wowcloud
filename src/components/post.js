import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/posts.module.css';

const Post = ({ post, categoryName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isEditMode, setIsEditMode] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    if (!isEditMode) {
      setEditedContent(post.content);
    }
    setIsEditMode(true);
  };

  const handleSave = () => {
    updatePost(post._id, editedContent)
      .then((updatedPost) => {
        console.log('Updated Post:', updatedPost);
        setIsEditMode(false);
      })
      .catch((error) => {
        console.error('Error updating post:', error);
      });
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
        return updatedPost;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update post. Please try again.');
    }
  };

  return (
    <div className={styles.post}>
      <h2 className={styles.postTitle} onClick={openModal}>
        {post.title}
      </h2>
      <span className={styles.postCategory}>{categoryName}</span>
      <span className={styles.postAuthor}>{post.author.username}</span>

      {isModalOpen ? (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalPostTitle}>{post.title}</h2>
            {!isEditMode ? (
              <p className={styles.modalPostContent}>{post.content}</p>
            ) : (
              <textarea
                className={styles.modalPostContent}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            )}
            {!isEditMode ? (
              <button className={styles.editButton} onClick={handleEdit}>
                Edit
              </button>
            ) : (
              <div>
                <button className={styles.saveButton} onClick={handleSave}>
                  Save Changes
                </button>
                <button className={styles.cancelButton} onClick={() => setIsEditMode(false)}>
                  Cancel
                </button>
              </div>
            )}
            <span className={styles.postAuthor}>{post.author.username}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Post;
