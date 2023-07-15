import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/posts.module.css';
import Comment from './comment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const Post = ({ post, categoryName, loggedInUser, updatePost, deletePost }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  useEffect(() => {
    fetchComments();
    checkLikedStatus();
  }, []);

  useEffect(() => {
    const likedStatus = localStorage.getItem(
      `post_${post._id}_liked_${loggedInUser?.id || 'guest'}`
    );
    setIsLiked(likedStatus === 'true');
  }, [post._id, loggedInUser?.id]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:9000/forum/posts/${post._id}/comments`, {
        params: { populate: 'author' },
      });
      const commentsData = response.data;
      const populatedComments = await Promise.all(
        commentsData.map(async (comment) => {
          const populatedComment = { ...comment };
          if (!populatedComment.author) {
            populatedComment.author = { username: 'Unknown User' };
          } else {
            const authorResponse = await axios.get(
              `http://localhost:9000/forum/users/${comment.author}`
            );
            populatedComment.author = authorResponse.data;
          }
          return populatedComment;
        })
      );
      setComments(populatedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation();
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

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle user not authenticated
        return;
      }

      const response = await axios.post(
        `http://localhost:9000/forum/posts/${post._id}/comments`,
        { content: newComment },
        { headers: { Authorization: token } }
      );
      const newCommentData = response.data;

      // Update the comments state with the new comment
      setComments((prevComments) => [...prevComments, newCommentData]);

      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const updateComment = async (commentId, content) => {
    try {
      const token = localStorage.getItem('token');
      if (token && content) {
        const response = await axios.put(
          `http://localhost:9000/forum/posts/${post._id}/comments/${commentId}`,
          { content },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const updatedComment = response.data;
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === updatedComment._id ? updatedComment : comment
          )
        );
        return updatedComment;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`http://localhost:9000/forum/posts/${post._id}/comments/${commentId}`, {
          headers: {
            Authorization: token,
          },
        });
        setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likeComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      await axios.post(
        `http://localhost:9000/forum/posts/${post._id}/comments/${commentId}/like`,
        null,
        { headers: { Authorization: token } }
      );

      // Fetch comments again to update the liked status
      fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const unlikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      await axios.post(
        `http://localhost:9000/forum/posts/${post._id}/comments/${commentId}/unlike`,
        null,
        { headers: { Authorization: token } }
      );

      // Fetch comments again to update the liked status
      fetchComments();
    } catch (error) {
      console.error('Error unliking comment:', error);
    }
  };

  const checkLikedStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLiked(false); // User is not authenticated, set liked status to false
        return;
      }

      const response = await axios.get(`http://localhost:9000/forum/posts/${post._id}/like-count`, {
        headers: { Authorization: token },
      });
      const { liked, count } = response.data;
      setIsLiked(liked);
      setLikeCount(count);
    } catch (error) {
      console.error('Error checking liked status:', error);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const endpoint = isLiked
        ? `http://localhost:9000/forum/posts/${post._id}/unlike`
        : `http://localhost:9000/forum/posts/${post._id}/like`;

      await axios.post(endpoint, null, { headers: { Authorization: token } });

      // Toggle the isLiked state
      setIsLiked(!isLiked);

      // Update the like count
      await checkLikedStatus();

      // Update the liked status in local storage
      localStorage.setItem(`post_${post._id}_liked_${loggedInUser._id}`, !isLiked);
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  return (
    <div className={styles.post}>
      <div className={styles.postLeftRight}>
        <div className={styles.postLeft}>
          <h2 className={styles.postTitle} onClick={openModal}>
            {post.title}
          </h2>
          <span className={styles.postCategory}>{categoryName}</span>
          <div>
            <span className={styles.postPosted}>Posted by </span>
            <span className={styles.postAuthor}>{post.author.username}</span>
          </div>
        </div>
        <div className={styles.postRight}>
          <span className={styles.likeCount}>{likeCount}</span>
          {loggedInUser ? (
            <FontAwesomeIcon
              icon={faThumbsUp}
              className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
              onClick={handleLike}
            />
          ) : null}
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.postContainer}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalPostTitle}>{post.title}</h2>
                <span className={styles.postCategory}>{categoryName}</span>
                <div>
                  <span className={styles.postPosted}>Posted by </span>
                  <span className={styles.postAuthor}>{post.author.username}</span>
                </div>
              </div>
              <div className={styles.modalContentContainer}>
                {!isEditMode ? (
                  <div
                    className={styles.modalPostContent}
                    dangerouslySetInnerHTML={{ __html: editedContent }}
                  ></div>
                ) : (
                  <textarea
                    className={styles.modalPostContent1}
                    rows='10'
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                )}
              </div>
              {loggedInUser?.username && post.author.username === loggedInUser.username && !isEditMode ? (
                <div className={styles.modalButtons}>
                  <button className={styles.editButton} onClick={handleEdit}>
                    Edit
                  </button>
                  <button className={styles.deleteButton} onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              ) : null}
              {isEditMode && (
                <div className={styles.modalButtons}>
                  <button className={styles.cancelButton} onClick={() => setIsEditMode(false)}>
                    Cancel
                  </button>
                  <button className={styles.saveButton} onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
            <div className={styles.commentsContainer}>
              <h3>Comments</h3>

              {loggedInUser && (
                <form className={styles.commentForm} onSubmit={handleSubmitComment}>
                  <textarea
                    className={styles.commentInput}
                    rows='3'
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Write a comment..."
                  />
                  <button className={styles.commentButton} type="submit">
                    Submit
                  </button>
                </form>
              )}
              <div className={styles.commentsContainer}>
                {comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    updateComment={updateComment}
                    deleteComment={deleteComment}
                    likeComment={likeComment}
                    unlikeComment={unlikeComment}
                    loggedInUser={loggedInUser}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
