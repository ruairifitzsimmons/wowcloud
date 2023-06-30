import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/loginregister.module.css';

const RegistrationForm = ({ isLoggedIn }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect the user to another page, such as the profile page
      router.push('/profile');
    }
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:9000/register', {
        email,
        password,
        username,
      });
      const data = response.data;
      if (data === 'exist') {
        alert('User already exists');
        console.log('User already exists');
      } else if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/profile');
        console.log('Registration successful');
      }
    } catch (error) {
      alert('An error occurred: ' + error.message);
      console.log(error);
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className={styles.formContainer}>
      <h1>Register</h1>
      <form className={styles.form} action="POST">
        <input
          className={styles.formInput}
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
          placeholder="Email"
          required
        />
        {emailError && <p className={styles.error}>{emailError}</p>}
        <input
          className={styles.formInput}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
          required
        />
        <input
          className={styles.formInput}
          type="text"
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameError('');
          }}
          placeholder="Username" // Add a placeholder for the username input
          required
        />
        {usernameError && <p className={styles.error}>{usernameError}</p>}
        <button
          className={styles.formButton}
          type="submit"
          onClick={submit}
        >
          Register
        </button>
      </form>
      <span>
        Have an account? <Link className={styles.formLink} href="/login">Login</Link>
      </span>
    </div>
  );
};

export default RegistrationForm;
