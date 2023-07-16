import React, { useState, useEffect } from 'react';
import styles from '../styles/posts.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const Comment = ({
  comment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  loggedInUser,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      setIsLiked(comment.likes.some((like) => like.userId === loggedInUser._id));
    }
  }, [comment.likes, loggedInUser]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    updateComment(comment._id, editedContent)
      .then((updatedComment) => {
        setIsEditMode(false);
        setEditedContent(updatedComment.content); // Update the editedContent state with the updated content
      })
      .catch((error) => {
        console.error('Error updating comment:', error);
      });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditedContent(comment.content); // Reset the edited content to the original content
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleLike = async () => {
    try {
      const updatedComment = await likeComment(comment._id);
      console.log('Liked Comment:', updatedComment);
      setIsLiked(true);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleUnlike = async () => {
    try {
      const updatedComment = await unlikeComment(comment._id);
      console.log('Unliked Comment:', updatedComment);
      setIsLiked(false);
    } catch (error) {
      console.error('Error unliking comment:', error);
    }
  };

  const isCommentOwner =
    loggedInUser &&
    comment.author &&
    loggedInUser.username === comment.author.username;

  const handleDelete = () => {
    if (
      loggedInUser &&
      comment.author &&
      loggedInUser.username === comment.author.username
    ) {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete this comment?'
      );
      if (confirmDelete) {
        deleteComment(comment._id)
          .then(() => {
            console.log('Comment deleted');
          })
          .catch((error) => {
            console.error('Error deleting comment:', error);
          });
      }
    } else {
      console.log('User is not authorized to delete this comment.');
    }
  };

  return (
    <div className={styles.comment}>
      <div className={styles.commentContainer}>
        <div className={styles.postLeft}>
          <div>
            <span className={styles.postPosted}>Posted by </span>
            <span className={styles.postAuthor}>
              {comment.author?.username || 'Unknown User'}
            </span>
          </div>
          {isEditMode ? (
            <textarea
              className={styles.modalCommentContent1}
              value={editedContent}
              onChange={handleContentChange}
            />
          ) : (
            <p className={styles.commentContent}>{comment.content}</p>
          )}
          {isCommentOwner && !isEditMode && (
            <div className={styles.modalButtons}>
              <button className={styles.editButton} onClick={handleEdit}>
                Edit
              </button>
              <button className={styles.deleteButton} onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
        <div className={styles.postRight}>
          <div className={styles.commentLikes}>
            <span className={styles.likeCount}>{comment.likes.length}</span>
            {loggedInUser && (
              <FontAwesomeIcon
                icon={faThumbsUp}
                onClick={isLiked ? handleUnlike : handleLike}
                className={`${styles.likeIcon} ${isLiked ? styles.liked : ''}`}
              />
            )}
          </div>
        </div>
      </div>

      {isEditMode && (
        <div className={styles.modalButtons}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;
