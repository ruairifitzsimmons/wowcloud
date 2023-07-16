import React, { useEffect } from 'react';
import Navbar from '../components/navbar';
import ProfileInfo from '../components/profileInfo';
import styles from '../styles/page.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';

function Profile() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      axios
        .get('http://localhost:9000/profile', {
          headers: {
            Authorization: token
          }
        })
        .then(response => {
          {/*console.log(response.data);*/}
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [])

  return (
    <div className={styles.main}>
      <Navbar />
      <ProfileInfo />
    </div>
  );
}

export default Profile;
