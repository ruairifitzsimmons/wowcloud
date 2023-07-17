import Head from 'next/head'
import styles from '../styles/page.module.css'
import DungeonList from '../components/dungeonList'
import Navbar from '../components/navbar'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
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

      <div className={styles.homeHeroOverlay}>
        <div className={styles.homeHero}>
          <h1 className={styles.homeHeroText}>WoW Cloud</h1>
          <div className={styles.homeHeroButtons}>
            <Link href='/character'>
              <button className={styles.homeHeroButton1}>Character Search</button>
            </Link>
            <Link href='/forum'>
              <button className={styles.homeHeroButton2}>Forum</button>
            </Link>
          </div>
        </div>
      </div>


      <div className={styles.homeSectionOne}>
          <div className={styles.homeSectionOneLeft}>
            <h2 className={styles.homeSectionHeader}>Character Search</h2>
            <p className={styles.homeSectionDesc}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text.</p>
            <Link href='/character'>
              <button className={styles.homeHeroButton1}>Search Character</button>
            </Link>
          </div>
          <div className={styles.homeSectionOneRight}>
          </div>
      </div>

      <div className={styles.homeSectionOne}>
          <div className={styles.homeSectionTwoLeft}>
          </div>
          <div className={styles.homeSectionTwoRight}>
            <h2 className={styles.homeSectionHeader}>Forum</h2>
            <p className={styles.homeSectionDesc}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text.</p>
            <Link href='/forum'>
              <button className={styles.homeHeroButton1}>Visit forum</button>
            </Link>
          </div>
      </div>

      <div className={styles.homeSectionOne}>
          <div className={styles.homeSectionOneLeft}>
            <h2 className={styles.homeSectionHeader}>In-game Content</h2>
            <p className={styles.homeSectionDesc}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text.</p>
            <Link href='/character'>
              <button className={styles.homeHeroButton1}>View content</button>
            </Link>
          </div>
          <div className={styles.homeSectionOneRight}>
          </div>
      </div>
    </main>
  )
}