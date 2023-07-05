import Head from 'next/head'
import Navbar from '../components/navbar'
import styles from '../styles/page.module.css'
import LoginForm from '../components/login'

export default function Login({ isLoggedIn }) {
  if (isLoggedIn) {
    return (
      <main className={styles.main}>
        <Head>
          <title>Login - WoW Cloud</title>
          <meta
            name='login'
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
        <title>Login - WoW Cloud</title>
        <meta
          name='login'
          content='World of Warcraft Community Site'
          key='desc'
        />
      </Head>
      <Navbar/>
      <div className={styles.loginRegisterContainer}>
        <LoginForm/>
      </div>
    </main>
  );
}
