import React from 'react';
import styles from '../styles/posts.module.css';

const Comment = ({ comment }) => {
    return (
      <div className={styles.comment}>
        <p className={styles.commentAuthor}>
          {comment.author && comment.author.username ? comment.author.username : 'Unknown User'}
        </p>
        <p className={styles.commentContent}>{comment.content}</p>
      </div>
    );
  };

export default Comment;
