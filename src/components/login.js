import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/loginRegistration.module.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check user login status on component mount
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      // Send a GET request to check if the user is logged in
      const response = await axios.get('http://localhost:9000/api/user');

      if (response.status === 200) {
        // User is logged in
        setLoggedIn(true);
        setUser(response.data);
      } else {
        // User is not logged in
        setLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Create a login object
    const loginData = {
      email,
      password,
    };

    try {
      // Send a POST request to the backend to log in the user
      const response = await axios.post('http://localhost:9000/api/login', loginData);

      if (response.status === 200) {
        // Login successful
        setLoggedIn(true);
        setUser(response.data);
        setEmail('');
        setPassword('');
        setErrorMessage('');
      } else {
        // Handle login error
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Send a GET request to log out the user
      await axios.get('http://localhost:9000/api/logout');
      setLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loggedIn) {
    return (
      <div>
        <p>Welcome, {user.username}!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <form className={styles.loginForm} onSubmit={handleLogin}>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Login</button>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;
