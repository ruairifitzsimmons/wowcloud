import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from '../styles/loginregister.module.css';
import { useRouter } from 'next/router';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      
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
      const response = await axios.post('http://localhost:9000/login', {
        email,
        password,
      });
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/profile');
        console.log('Login successful');
      } else {
        alert(data.message);
        console.log('Login failed');
      }
    } catch (error) {
      alert('Login failed, incorrect details');
      console.log(error);
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className={styles.formContainer}>
      <h1>Login</h1>
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
        <button
          className={styles.formButton}
          type="submit"
          onClick={submit}
        >
          Log in
        </button>
      </form>
      <span>
        Not have an account? <Link className={styles.formLink} href="/register">Register</Link>
      </span>
    </div>
  );
};

export default LoginForm;
