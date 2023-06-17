import Head from 'next/head'
import Navbar from '../components/navbar'
import styles from '../styles/page.module.css'
import RegistrationForm from '../components/registration'

export default function loginRegister() {
    return (
        <main className={styles.main}>
          <Head>
            <title>Login/Register - WoW Cloud</title>
            <meta
              name='login/register'
              content='World of Warcraft Community Site'
              key='desc'
            />
          </Head>
          <Navbar/>
          <div>
            <RegistrationForm/>
          </div>
        </main>
      )
}