import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchDungeonsByExpansion, getDungeonMedia, getDungeonDetails, getEncounterDetails } from '../../../backend/controllers/dungeonController';
import Navbar from '../../../components/navbar';
import styles from '../../../styles/dungeon.module.css';

const DungeonPage = ({ dungeonData, dungeonMedia, dungeonDetails, encounters }) => {
  const router = useRouter();
  const { expansionId, dungeonId } = router.query;

  const [loading, setLoading] = useState(true);
  const [selectedEncounter, setSelectedEncounter] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleEncounterClick = (encounter) => {
    setSelectedEncounter(encounter);
    setIsPopupOpen(true); // Open the popup
  };

  const closePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  const handleOverlayClick = (e) => {
    // Check if the clicked element is the overlay itself (not its children)
    if (e.target.classList.contains(styles.modalOverlay)) {
      closePopup();
    }
  };

  // Attach the event listener when the popup opens
  useEffect(() => {
    if (isPopupOpen) {
      document.addEventListener('click', handleOverlayClick);
    }

    // Detach the event listener when the component unmounts or the popup is closed
    return () => {
      document.removeEventListener('click', handleOverlayClick);
    };
  }, [isPopupOpen]);

  useEffect(() => {
    // Check if all data is available before rendering
    if (dungeonData && dungeonMedia && dungeonDetails) {
      setLoading(false);
    }
  }, [dungeonData, dungeonMedia, dungeonDetails]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className={styles.dungeonContainer}>
          <h1 className={styles.dungeonName}>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className={styles.dungeonsContainer}>
        <h1 className={styles.dungeonName}>{dungeonData.name}</h1>
        <img src={dungeonMedia?.assets?.[0]?.value} alt={dungeonData.name} className={styles.dungeonImage} />
        <p className={styles.dungeonDescription}>{dungeonDetails.description}</p>
        <h2 className={styles.encountersHeading}>Bosses:</h2>
        <div className={styles.encountersList}>
          {dungeonDetails.encounters.map((encounter) => (
            <div className={styles.encounterContainer} key={encounter.id} onClick={() => handleEncounterClick(encounter)}>
              <h3 className={styles.encounterName}>{encounter.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {isPopupOpen && selectedEncounter && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContainer}>
              <h2 className={styles.encounterName}>{selectedEncounter.name}</h2>
              <p className={styles.encounterDescription}>{selectedEncounter.description}</p>
              <h3 className={styles.subHeader}>Loot</h3>
              <div className={styles.itemContainer}>
                {selectedEncounter.items &&
                  selectedEncounter.items.map((item) => {
                    return (
                      <div className={styles.item} key={item.id}>
                        <span className={styles.itemName}>{item.item.name}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { expansionId, dungeonId } = context.params;

  try {
    // Fetch dungeon data and find the selected dungeon
    const dungeonData = await fetchDungeonsByExpansion(expansionId);
    const dungeon = dungeonData.dungeons.find((dungeon) => dungeon.id === parseInt(dungeonId));

    // Fetch dungeon media and details
    const dungeonMedia = await getDungeonMedia(dungeonId);
    const dungeonDetails = await getDungeonDetails(dungeonId);

    // Fetch encounter details for each encounter in dungeonDetails
    const encounters = [];
    for (const encounter of dungeonDetails.encounters) {
      try {
        const encounterDetails = await getEncounterDetails(encounter.id);
        encounter.items = encounterDetails.items;
        encounter.description = encounterDetails.description;

        encounters.push(encounter);
      } catch (error) {
        console.error('Error fetching encounter details:', error);
      }
    }

    return {
      props: {
        dungeonData: dungeon,
        dungeonMedia,
        dungeonDetails,
        encounters,
      },
    };
  } catch (error) {
    console.error('Error fetching dungeon:', error);
    return {
      props: {
        dungeonData: null,
        dungeonMedia: null,
        dungeonDetails: null,
        encounters: [],
      },
    };
  }
}

export default DungeonPage;