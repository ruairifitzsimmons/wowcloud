import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchDungeonsByExpansion, getDungeonMedia } from '../../backend/controllers/dungeonController';
import Navbar from '../../components/navbar';
import styles from '../../styles/dungeons.module.css';

const ExpansionPage = ({ raidsData, raidsData1, raidsMedia }) => {
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
    router.push(`/raids/${selectedExpansionId}`);
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
        <h1 className={styles.expansionName}>{raidsData1}</h1>

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
          {raidsData.map((raidsData, index) => (
            <a
              key={raidsData.id}
              className={styles.dungeonsItem}
              href={`/raids/${expansionId}/${raidsData.id}`}
              style={{
                backgroundImage: `url(${raidsMedia[index]?.assets[0]?.value})`,
              }}
            >
              <span className={styles.dungeonsName}>
                {raidsData.name}
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
    const raidsData = await fetchDungeonsByExpansion(expansionId);
    const raidIds = raidsData.raids.map((raid) => raid.id);
    const raidMediaPromises = raidIds.map((raidId) =>
      getDungeonMedia(raidId)
    );
    const raidsMedia = await Promise.all(raidMediaPromises);
    return {
      props: {
        raidsData: raidsData.raids,
        raidsData1: raidsData.name,
        raidsMedia: raidsMedia,
      },
    };
  } catch (error) {
    console.error('Error fetching raids:', error);
    return {
      props: {
        raidsData: [],
      },
    };
  }
}

export default ExpansionPage;