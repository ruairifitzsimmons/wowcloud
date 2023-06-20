import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from '../styles/loginregister.module.css';
import { useRouter } from 'next/router';

const LoginForm = () => {

    const router = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function submit(e) {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/login', {
                email, password
            }).then(res => {
                if (res.data === 'exist') {
                    router.push('/profile')
                    console.log('exist')
                } else if (res.data === 'notexist') {
                    alert('User does not exist')
                    console.log('exist')
                }
            }).catch (e => {
                alert('Wrong details: ' + e.message);
                console.log(e);
            })
        } catch(e) {
            console.log(e);
        }
    }

  return (
    <div className={styles.formContainer}>
        <h1>Login</h1>
        <form className={styles.form} action ="POST">
            <input 
                className={styles.formInput}
                type = "email"
                onChange = {(e) => { setEmail(e.target.value) }}
                placeholder = "Email"
                name = ""
                id = ""
            />
            <input 
                className={styles.formInput}
                type = "password"
                onChange = {(e) => { setPassword(e.target.value ) }}
                placeholder = "Password"
                name = ""
                id = ""
            />
            <button
                className={styles.formButton}
                type = "submit"
                onClick = {submit}
            >Log in</button>
        </form>
        <span>Not have an account?<Link href="/register">Register</Link></span>
    </div>
  )
};

export default LoginForm;