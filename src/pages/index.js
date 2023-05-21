import Head from 'next/head'
import styles from '../styles/page.module.css'
import DungeonList from '../components/dungeonList'
import CharacterSearch from '../components/character'
import Navbar from '../components/navbar'

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
      <div>
        <h1>WoW Cloud</h1>
        <CharacterSearch/>
        <DungeonList/>
      </div>
    </main>
  )
}