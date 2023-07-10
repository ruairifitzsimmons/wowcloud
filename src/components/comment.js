import React from 'react';
import styles from '../styles/posts.module.css';

const Comment = ({ comment }) => {
    return (
      <div className={styles.comment}>
        <div>
          <span className={styles.postPosted}>Posted by </span>
          <span className={styles.postAuthor}>{comment.author && comment.author.username ? comment.author.username : 'Unknown User'}</span>
        </div>
        <p className={styles.commentContent}>{comment.content}</p>
      </div>
    );
  };

export default Comment;
