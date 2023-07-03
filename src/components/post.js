import React from 'react';
import styles from '../styles/posts.module.css';

const Post = ({ post, categoryName }) => {
  return (
    <div className={styles.post}>
      <h2 className={styles.postTitle}>{post.title}</h2>
      <span className={styles.postCategory}>{categoryName}</span>
      {/*<p>{post.content}</p>*/}
      <span className={styles.postAuthor}>{post.author.username}</span>
    </div>
  );
};

export default Post;