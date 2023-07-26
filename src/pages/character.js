// pages/character.js

import Head from 'next/head';
import styles from '../styles/page.module.css';
import { useRouter } from 'next/router';
import CharacterSearch from '../components/character';
import Navbar from '../components/navbar';

export default function Character() {
  const router = useRouter();
  const { realmSlug, characterName } = router.query;

  return (
    <main className={styles.main}>
      <Head>
        <title>WoW Cloud</title>
        <meta
          name="description"
          content="World of Warcraft Community Site"
          key="desc"
        />
      </Head>
      <Navbar />
      <div>
        <CharacterSearch
          initialRealmSlug={realmSlug}
          initialCharacterName={characterName}
        />
      </div>
    </main>
  );
}
