import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from '../styles/loginregister.module.css';
import { useRouter } from 'next/router';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

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

      if (data === 'exist') {
        router.push('/profile');
        console.log('Login successful');
      } else if (data === 'notexist') {
        alert('User does not exist');
        console.log('User does not exist');
      } else if (data === 'passwordincorrect') {
        alert('Incorrect password');
        console.log('Incorrect password');
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
        Not have an account? <Link href="/register">Register</Link>
      </span>
    </div>
  );
};

export default LoginForm;
