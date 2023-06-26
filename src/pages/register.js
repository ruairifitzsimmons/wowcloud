import Head from 'next/head'
import Navbar from '../components/navbar'
import styles from '../styles/page.module.css'
import RegistrationForm from '../components/register'

export default function Register({ isLoggedIn }) {
  if (isLoggedIn) {
    // Redirect the user to another page, such as the profile page
    // or display a message indicating they are already logged in
    return (
      <main className={styles.main}>
        <Head>
          <title>Register - WoW Cloud</title>
          <meta
            name='Register'
            content='World of Warcraft Community Site'
            key='desc'
          />
        </Head>
        <Navbar/>
        <div className={styles.loginRegisterContainer}>
          <p>You are already logged in.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Head>
        <title>Register - WoW Cloud</title>
        <meta
          name='Register'
          content='World of Warcraft Community Site'
          key='desc'
        />
      </Head>
      <Navbar/>
      <div className={styles.loginRegisterContainer}>
        <RegistrationForm isLoggedIn={isLoggedIn}/>
      </div>
    </main>
  );
}
