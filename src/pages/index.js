import styles from '../styles/page.module.css'
import DungeonList from '../components/dungeonList'
import Head from 'next/head'

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
      <div>
        <h1>WoW Cloud</h1>
        <DungeonList/>
      </div>
    </main>
  )
}