import Image from 'next/image'
import styles from './page.module.css'
import Test from './components/test'

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <Test />
        <h1>Hello World!</h1>
      </div>
    </main>
  )
}
