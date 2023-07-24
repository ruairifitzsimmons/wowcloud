import Head from 'next/head'
import styles from '../styles/game.module.css'
import Navbar from '../components/navbar'
import Link from 'next/link'

export default function Game() {
  return (
    <main className={styles.main}>
      <Head>
        <title>Dungeons - WoW Cloud</title>
        <meta
          name='Dungeons'
          content='World of Warcraft Community Site'
          key='desc'
        />
      </Head>
      <Navbar/>

        <div className={styles.sectionContainer}>
            <Link href='/dungeons/68' passHref className={styles.linkStyle}>
            <div className={`${styles.gameSection} ${styles.classic}`}>
                <span className={styles.sectionHeader}>Classic</span>
            </div>
            </Link>
            <Link href='/dungeons/70' passHref className={styles.linkStyle}>
            <div className={`${styles.gameSection} ${styles.tbc}`}>
                <span className={styles.sectionHeader}>Burning Crusade</span>
            </div>
            </Link>
            <Link href='/dungeons/72' passHref className={styles.linkStyle}>
            <div className={`${styles.gameSection} ${styles.wotlk}`}>
                <span className={styles.sectionHeader}>Wrath of the Lich King</span>
            </div>
            </Link>
            <Link href='/dungeons/73' passHref className={styles.linkStyle}>
            <div className={`${styles.gameSection} ${styles.cata}`}>
                <span className={styles.sectionHeader}>Cataclysm</span>
            </div>
            </Link>
            <Link href='/dungeons/74' passHref className={styles.linkStyle}>
            <div className={`${styles.gameSection} ${styles.mists}`}>
                <span className={styles.sectionHeader}>Mists of Pandaria</span>
            </div>
            </Link>
            <Link href='/dungeons/124' passHref className={styles.linkStyle}>
            <div className={`${styles.gameSection} ${styles.wod}`}>
                <span className={styles.sectionHeader}>Warlords of Draenor</span>
            </div>
            </Link>
            <Link href='/dungeons/395' passHref className={styles.linkStyle}>
            <div className={`${styles.gameSection} ${styles.legion}`}>
                <span className={styles.sectionHeader}>Legion</span>
            </div>
            </Link>
            <Link href='/dungeons/396' passHref className={styles.linkStyle}>
            <div className={`${styles.gameSection} ${styles.bfa}`}>
                <span className={styles.sectionHeader}>Battle for Azeroth</span>
            </div>
            </Link>
            <Link href='/dungeons/499' passHref className={styles.linkStyle}>
            <div className={`${styles.gameSection} ${styles.sl}`}>
                <span className={styles.sectionHeader}>Shadowlands</span>
            </div>
            </Link>
            <Link href='/dungeons/503' passHref className={styles.linkStyle}>
            <div className={`${styles.gameSection} ${styles.df}`}>
                <span className={styles.sectionHeader}>Dragonflight</span>
            </div>
            </Link>
        </div>
    </main>
  )
}