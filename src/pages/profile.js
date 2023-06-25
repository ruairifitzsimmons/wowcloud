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
      // User is not authenticated, redirect to login page
      router.push('/login');
    } else {
      // User is authenticated, make a request to the /profile endpoint to retrieve the user data
      axios
        .get('http://localhost:9000/profile', {
          headers: {
            Authorization: token
          }
        })
        .then(response => {
          console.log(response.data);
          // Handle the profile data response here
        })
        .catch(error => {
          console.log(error);
          // Handle any error that occurred during the API request
        });
    }
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  return (
    <div className={styles.main}>
      <Navbar />
      <ProfileInfo />
    </div>
  );
}

export default Profile;
