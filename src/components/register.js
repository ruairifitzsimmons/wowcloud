import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/loginregister.module.css';

const RegistrationForm = () => {

    const router = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function submit(e) {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/register', {
                email, password
            }).then(res => {
                if (res.data === 'exist') {
                    alert('User already exists')
                    console.log('exist')
                } else if (res.data === 'notexist') {
                    router.push('/profile')
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
        <h1>Register</h1>
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
                onChange = {(e) => { setPassword(e.target.value) }}
                placeholder = "Password"
                name = ""
                id = ""
            />
            <button
                className={styles.formButton}
                type = "submit"
                onClick = {submit}
            >
                Register
            </button>
        </form>
        <span>Have an account?<Link href="/login">Login</Link></span>
    </div>
  )
};

export default RegistrationForm;