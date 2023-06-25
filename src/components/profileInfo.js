import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/profile.module.css';

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
          const userEmail = response.data.email; // Access the email property
          setEmail(userEmail); // Set the email value in state
        })
        .catch(error => {
          console.log(error);
          // Handle any error that occurred during the API request
        });
    } else {
      // User is not authenticated, redirect to login page
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
      </div>
    </div>
  );
};

export default ProfileInfo;
