import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/loginregister.module.css';

const RegistrationForm = () => {
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
      const response = await axios.post('http://localhost:9000/register', {
        email,
        password,
      });
      const data = response.data;

      if (data === 'exist') {
        alert('User already exists');
        console.log('User already exists');
      } else if (data === 'notexist') {
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
        <button
          className={styles.formButton}
          type="submit"
          onClick={submit}
        >
          Register
        </button>
      </form>
      <span>
        Have an account? <Link href="/login">Login</Link>
      </span>
    </div>
  );
};

export default RegistrationForm;
