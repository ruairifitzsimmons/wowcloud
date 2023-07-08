import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/posts.module.css';

const Post = ({ post, categoryName, loggedInUser, updatePost, deletePost }) => {
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
    if (loggedInUser && post.author.username === loggedInUser.username) {
      if (!isEditMode) {
        setEditedContent(post.content);
      }
      setIsEditMode(true);
    } else {
      console.log('User is not authorized to edit this post.');
    }
  };

  const handleSave = () => {
    updatePost(post._id, editedContent)
      .then((updatedPost) => {
        console.log('Updated Post:', updatedPost);
        setIsEditMode(false);
        setEditedContent(updatedPost.content); // Update the editedContent state with the updated content
      })
      .catch((error) => {
        console.error('Error updating post:', error);
      });
  };

  const handleDelete = () => {
    if (loggedInUser && post.author.username === loggedInUser.username) {
      deletePost(post._id)
        .then(() => {
          console.log('Post deleted');
          closeModal(); // Close the modal after successful deletion
        })
        .catch((error) => {
          console.error('Error deleting post:', error);
        });
    } else {
      console.log('User is not authorized to delete this post.');
    }
  };

  return (
    <div className={styles.post}>
      <h2 className={styles.postTitle} onClick={openModal}>
        {post.title}
      </h2>
      <span className={styles.postCategory}>{categoryName}</span>
      <span className={styles.postAuthor}>{post.author.username}</span>
      
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalPostTitle}>{post.title}</h2>
            {!isEditMode ? (
              <p className={styles.modalPostContent}>{editedContent}</p>
            ) : (
              <textarea
                className={styles.modalPostContent}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            )}
            {loggedInUser && post.author.username === loggedInUser.username && !isEditMode ? (
              <div>
                <button className={styles.editButton} onClick={handleEdit}>
                  Edit
                </button>
                <button className={styles.deleteButton} onClick={handleDelete}>
                  Delete
                </button>
              </div>
            ) : null}
            {isEditMode && (
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
      )}
    </div>
  );
};

export default Post;