import Head from 'next/head'
import Navbar from '../components/navbar'
import styles from '../styles/page.module.css'
import RegistrationForm from '../components/register'

export default function Register() {
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
          <RegistrationForm/>
        </div>
      </main>
    )
}