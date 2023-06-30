import Head from 'next/head'
import styles from '../styles/page.module.css'
import Navbar from '../components/navbar'
import ForumPosts from '../components/forumPosts'

export default function Forum() {
    return (
      <main className={styles.main}>
        <Head>
          <title>Forum - WoW Cloud</title>
          <meta
            name='description'
            content='World of Warcraft Community Site'
            key='desc'
          />
        </Head>
        <Navbar/>
        <ForumPosts/>
        <div>
        </div>
      </main>
    )
  }