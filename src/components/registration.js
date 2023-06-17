import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/loginRegistration.module.css';

const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new user object
    const newUser = {
      username,
      email,
      password,
    };
    console.log('newUser:', newUser);

    try {
      // Send a POST request to the backend to create a new user
      const response = await axios.post('http://localhost:9000/api/users', newUser);

      if (response.status === 201) {
        // User created successfully
        console.log('User registered successfully!');
        // Reset form fields
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        // Handle error
        console.error('Failed to register user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
