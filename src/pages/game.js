import Head from 'next/head'
import styles from '../styles/game.module.css'
import Navbar from '../components/navbar'
import Link from 'next/link'

export default function Game() {
  return (
    <main className={styles.main}>
      <Head>
        <title>Game - WoW Cloud</title>
        <meta
          name='description'
          content='World of Warcraft Community Site'
          key='desc'
        />
      </Head>
      <Navbar/>

        <div className={styles.sectionContainer}>
            <Link href='/dungeons/68' passHref className={styles.linkStyle}>
            <div className={`${styles.gameSection} ${styles.dungeonsImage}`}>
                <span className={styles.sectionHeader}>Dungeons</span>
            </div>
            </Link>
            <Link href='/raids/68' passHref className={styles.linkStyle}>
              <div className={`${styles.gameSection} ${styles.raidsImage}`}>
                  <span className={styles.sectionHeader}>Raids</span>
              </div>
            </Link>
            <div className={`${styles.gameSection} ${styles.classesImage}`}>
                <span className={styles.sectionHeader}>Classes</span>
            </div>
        </div>
    </main>
  )
}