import styles from './page.module.css'
import DungeonList from './dungeonList'

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <h1>WoW Cloud</h1>
        <DungeonList/>
      </div>
    </main>
  )
}