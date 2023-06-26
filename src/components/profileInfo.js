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
          const userEmail = response.data.email;
          setEmail(userEmail);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      router.push('/login');
    }
  }, []);

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
          <span className={styles.profileInfoUsername}>Username</span>
          <span className={styles.profileInfoEmail}>Email: {email}</span>
        </div>
        <button className={styles.logoutButton} onClick={() => logout(router)}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileInfo;
