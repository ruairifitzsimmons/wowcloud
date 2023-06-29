import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/profile.module.css';

const logout = async (router) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await axios.post('http://localhost:9000/logout', {}, {
        headers: {
          Authorization: token,
        },
      });
      localStorage.removeItem('token');
      router.push('/login');
    }
  } catch (error) {
    console.log(error);
  }
};

const ProfileInfo = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        axios
        .get('http://localhost:9000/profile', {
          headers: {
            Authorization: token,
          },
        })
        .then(response => {
          const userData = response.data;
          setUsername(userData.username);
          setEmail(userData.email);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      router.push('/login');
    }
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
        .then(response => {
          const updatedUsername = response.data.username;
          setUsername(updatedUsername);
          setEditing(false);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setNewUsername('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.postsContainer}>
          <span>My posts</span>
          <div className={styles.post}>
            <span>Posts</span>
          </div>
          <div className={styles.post}>
            <span>Posts</span>
          </div>
          <div className={styles.post}>
            <span>Posts</span>
          </div>
        </div>
        <div className={styles.profileInfoContainer}>
        {editing ? (
            <div>
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
              />
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <div>
              <span className={styles.profileInfoUsername}>Username: {username}</span>
              <span className={styles.profileInfoEmail}>Email: {email}</span>
              <button onClick={handleEdit}>Edit Username</button>
            </div>
          )}
        </div>
        <button className={styles.logoutButton} onClick={() => logout(router)}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileInfo;
