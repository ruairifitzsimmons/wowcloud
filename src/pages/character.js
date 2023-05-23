import Head from 'next/head'
import styles from '../styles/page.module.css'
import CharacterSearch from '../components/character'
import Navbar from '../components/navbar'

export default function Character() {
    return (
      <main className={styles.main}>
        <Head>
          <title>WoW Cloud</title>
          <meta
            name='description'
            content='World of Warcraft Community Site'
            key='desc'
          />
        </Head>
        <Navbar/>
        <div>
          <CharacterSearch/>
        </div>
      </main>
    )
  }