import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchDungeonsByExpansion, getDungeonMedia } from '../../backend/controllers/dungeonController';
import Navbar from '../../components/navbar';
import styles from '../../styles/dungeons.module.css';

const ExpansionPage = ({ dungeonsData, dungeonsData1, dungeonsMedia }) => {
  const router = useRouter();
  const { expansionId } = router.query;

  // Expansion data with their IDs
  const expansions = [
    { name: 'Classic', id: 68 },
    { name: 'Burning Crusade', id: 70 },
    { name: 'Wrath of the Lich King', id: 72 },
    { name: 'Cataclysm', id: 73 },
    { name: 'Mists of Pandaria', id: 74 },
    { name: 'Warlords of Draenor', id: 124 },
    { name: 'Legion', id: 395 },
    { name: 'Battle for Azeroth', id: 396 },
    { name: 'Shadowlands', id: 499 },
    { name: 'Dragonflight', id: 503 },
  ];

  const handleExpansionChange = (selectedExpansionId) => {
    router.push(`/dungeons/${selectedExpansionId}`);
  };

  // For mobile view
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 769) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className={styles.dungeonsContainer}>
        <h1 className={styles.expansionName}>{dungeonsData1}</h1>

        {/* Show buttons on desktop */}
        <div className={`${styles.expansionButtons} ${showDropdown ? styles.hideOnMobile : ''}`}>
          {/* Map each expansion to a button */}
          {expansions.map((expansion) => (
            <button
              key={expansion.id}
              className={`${styles.expansionButton} ${expansionId == expansion.id ? styles.activeButton : ''}`}
              onClick={() => handleExpansionChange(expansion.id)}
            >
              {expansion.name}
            </button>
          ))}
        </div>

        {/* Show dropdown on mobile */}
        {showDropdown && (
          <div className={styles.expansionButtonsContainer}>
            <select className={styles.expansionSelect} value={expansionId} onChange={(e) => handleExpansionChange(e.target.value)}>
              {expansions.map((expansion) => (
                <option key={expansion.id} value={expansion.id}>
                  {expansion.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.dungeonsGrid}>
          {dungeonsData.map((dungeonData, index) => (
            <a
              key={dungeonData.id}
              className={styles.dungeonsItem}
              href={`/dungeons/${expansionId}/${dungeonData.id}`}
              style={{
                backgroundImage: `url(${dungeonsMedia[index]?.assets[0]?.value})`,
              }}
            >
              <span className={styles.dungeonsName}>
                {dungeonData.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
export async function getServerSideProps(context) {
  const { expansionId } = context.params;

  try {
    const dungeonsData = await fetchDungeonsByExpansion(expansionId);
    const dungeonIds = dungeonsData.dungeons.map((dungeon) => dungeon.id);
    const dungeonMediaPromises = dungeonIds.map((dungeonId) =>
      getDungeonMedia(dungeonId)
    );
    const dungeonsMedia = await Promise.all(dungeonMediaPromises);
    return {
      props: {
        dungeonsData: dungeonsData.dungeons,
        dungeonsData1: dungeonsData.name,
        dungeonsMedia: dungeonsMedia,
      },
    };
  } catch (error) {
    console.error('Error fetching dungeons:', error);
    return {
      props: {
        dungeonsData: [],
      },
    };
  }
}

export default ExpansionPage;