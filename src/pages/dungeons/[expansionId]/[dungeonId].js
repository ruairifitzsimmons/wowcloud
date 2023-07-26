import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  fetchDungeonsByExpansion,
  getDungeonMedia,
  getDungeonDetails,
  getEncounterDetails,
  getItemMedia,
  getItemInformation,
} from "../../../backend/controllers/dungeonController";
import Navbar from "../../../components/navbar";
import styles from "../../../styles/dungeon.module.css";

const DungeonPage = ({
  dungeonData,
  dungeonMedia,
  dungeonDetails,
}) => {
  const router = useRouter();

  const getItemQualityName = (qualityType) => {
    switch (qualityType) {
      case "EPIC":
        return styles.epic;
      case "RARE":
        return styles.rare;
      case "UNCOMMON":
        return styles.uncommon;
      case "COMMON":
        return styles.common;
      default:
        return "Unknown";
    }
  };

  const [loading, setLoading] = useState(true);
  const [selectedEncounter, setSelectedEncounter] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [encounterLoading, setEncounterLoading] = useState(false);

  // Function to fetch encounter data when the user clicks on an encounter
  const fetchEncounterData = async (encounter) => {
    try {
      setEncounterLoading(true);
      const encounterDetails = await getEncounterDetails(encounter.id);
      encounter.items = encounterDetails.items;
      encounter.sections = encounterDetails.sections;
      encounter.description = encounterDetails.description;

      // Get item media for each item in the encounter
      const itemIds = encounter.items.map((item) => item.item.id);
      const itemMediaPromises = itemIds.map((itemId) => getItemMedia(itemId));
      const itemMediaData = await Promise.all(itemMediaPromises);

      // Merge the item media data with the encounter items
      encounter.items = encounter.items.map((item, index) => ({
        ...item,
        media: itemMediaData[index]?.assets?.[0]?.value,
      }));

      // Get item information for each item in the encounter
      const itemInformationPromises = itemIds.map((itemId) =>
        getItemInformation(itemId)
      );
      const itemInformationData = await Promise.all(itemInformationPromises);

      // Merge the item information data with the encounter items
      encounter.items = encounter.items.map((item, index) => ({
        ...item,
        information: itemInformationData[index], // Add the item information to the item object
      }));

      setSelectedEncounter(encounter); // Update the selected encounter with its data
    } catch (error) {
      console.error("Error fetching encounter details:", error);
    } finally {
      setEncounterLoading(false); // Set the loading state back to false when the data is fetched
    }
  };

  const handleEncounterClick = (encounter) => {
    fetchEncounterData(encounter); // Fetch encounter data when the user clicks on an encounter
    setIsPopupOpen(true); // Open the popup
  };

  // Function to handle clicking the back button
  const handleBackButtonClick = () => {
    router.back(); // Navigate back to the previous page
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

  // Function to handle mouse hover on an item
  const handleItemMouseEnter = (item) => {
    setHoveredItem(item);
  };

  // Function to handle mouse leave from an item
  const handleItemMouseLeave = () => {
    setHoveredItem(undefined);
  };

  const handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    setPopupPosition({ x, y });
  };
  
  useEffect(() => {
    if (isPopupOpen) {
      document.addEventListener("click", handleOverlayClick);
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      document.removeEventListener("click", handleOverlayClick);
      // Remove the 'mousemove' event listener when the popup is closed
      document.removeEventListener("mousemove", handleMouseMove);
    }

    // Detach the event listeners when the component unmounts
    return () => {
      document.removeEventListener("click", handleOverlayClick);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isPopupOpen]);

  useEffect(() => {
    // Check if all data is available before rendering
    if (dungeonData && dungeonMedia && dungeonDetails) {
      setLoading(false);
    }
  }, [dungeonData, dungeonMedia, dungeonDetails]);

  useEffect(() => {
    if (hoveredItem) {
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
    }

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hoveredItem]);

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
        <button className={styles.backButton} onClick={handleBackButtonClick}>Back</button>
        <h1 className={styles.dungeonName}>{dungeonData.name}</h1>
        <div className={styles.dungeonMeta}>
          <span className={styles.dungeonMetadata}><span className={styles.dungeonMetatitle}>Instance Type: </span>{dungeonDetails.category.type}</span>
          <span className={styles.dungeonMetadata}><span className={styles.dungeonMetatitle}>Expansion: </span>{dungeonDetails.expansion.name}</span>
          <span className={styles.dungeonMetadata}><span className={styles.dungeonMetatitle}>Location: </span>{dungeonDetails.location.name}</span>
        </div>
        <img
          src={dungeonMedia?.assets?.[0]?.value}
          alt={dungeonData.name}
          className={styles.dungeonImage}
        />
        <p className={styles.dungeonDescription}>
          {dungeonDetails.description}
        </p>
        <div className={styles.encountersContainer}>
          <h2 className={styles.encountersHeading}>Bosses:</h2>
          <div className={styles.encountersList}>
            {dungeonDetails.encounters.map((encounter) => (
              <div
                className={styles.encounterContainer}
                key={encounter.id}
                onClick={() => handleEncounterClick(encounter)}
              >
                <h3 className={styles.encounterName}>{encounter.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isPopupOpen && selectedEncounter && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContainer}>
              <div className={styles.encounterHeader}>
                <h2 className={styles.encounterName}>
                  {selectedEncounter.name}
                </h2>
                <p className={styles.encounterDescription}>
                  {selectedEncounter.description}
                </p>
              </div>

              {encounterLoading ? (
                <p className={styles.loading}>Loading Items...</p>
              ) : (

              <div className={styles.lootContainer}>
                <h3 className={styles.subHeader}>Loot</h3>
                <div className={styles.itemContainer}>
                  {selectedEncounter.items &&
                    selectedEncounter.items.map((item) => {
                      
                      const qualityClass = getItemQualityName(
                        item.information.quality.type
                      );
                      return (
                        <div
                          className={styles.item}
                          key={item.id}
                          onMouseEnter={() => handleItemMouseEnter(item)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <img
                            className={styles.itemImage}
                            src={item.media}
                            alt={item.item.name}
                          />
                          <div className={styles.itemHeader}>
                            <span className={`${styles.itemName} ${qualityClass}`}>
                              {item.item.name}
                            </span>
                            <span className={styles.itemLevel}>
                              {item.information.preview_item.level.display_string}
                            </span>
                          </div>
                          {hoveredItem === item && (
                            <div
                              className={styles.itemPopup}
                              style={{
                                left: `${popupPosition.x}px`,
                                top: `${popupPosition.y}px`,
                              }}
                            >
                              <span className={`${styles.popupname} ${qualityClass}`}>
                                {item.item.name}
                              </span>
                              {item.information.preview_item.level && (
                                <span className={styles.popupitemlevel}>
                                  {item.information.preview_item.level.display_string}
                                </span>
                              )}

                              {item.information.preview_item.binding && (
                                <span>
                                  {item.information.preview_item.binding.name}
                                </span>
                              )}

                              <div className={styles.itemslotarmor}>
                                {item.information.preview_item
                                  .inventory_type && (
                                  <span>
                                    {
                                      item.information.preview_item
                                        .inventory_type.name
                                    }
                                  </span>
                                )}
                                {item.information.preview_item
                                  .item_subclass && (
                                  <span>
                                    {
                                      item.information.preview_item
                                        .item_subclass.name
                                    }
                                  </span>
                                )}
                              </div>

                              {item.information.preview_item.weapon && (
                                <div className={styles.itemslotarmor}>
                                  <span>
                                    {
                                      item.information.preview_item.weapon
                                        .damage.display_string
                                    }
                                  </span>
                                  <span>
                                    {
                                      item.information.preview_item.weapon
                                        .attack_speed.display_string
                                    }
                                  </span>
                                </div>
                              )}

                              {item.information.preview_item.stats &&
                                item.information.preview_item.stats.map(
                                  (stat, index) => (
                                    <span
                                      key={`stat_${index}`}
                                      value={stat.value}
                                    >
                                      {stat.display.display_string}
                                    </span>
                                  )
                                )}

                              {item.information.preview_item.requirements?.level?.display_string && (
                                <span>
                                  {item.information.preview_item.requirements.level.display_string}
                                </span>
                              )}

                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
              )}

              {encounterLoading ? (
                <p className={styles.loading}>Loading Encounter Details...</p>
              ) : (

              <div className={styles.sectionContainer}>
                <h3 className={styles.subHeader}>Encounter</h3>
                {selectedEncounter.sections &&
                  selectedEncounter.sections.map((section) => (
                    <div className={styles.section} key={section.id}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionTitle}>
                          {section.title}
                        </span>
                        <p className={styles.subSectionDescription}>
                          {section.body_text}
                        </p>
                      </div>
                      <div className={styles.subSectionContainer}>
                        {section.sections &&
                          section.sections.map((subSection) => (
                            <div
                              className={styles.subSection}
                              key={subSection.id}
                            >
                              <span className={styles.subSectionTitle}>
                                {subSection.title}
                              </span>
                              {/* Remove the $bullet; from the sub-section body_text */}
                              <p className={styles.subSectionDescription}>
                                {subSection.body_text
                                  ? subSection.body_text.replace(
                                      /\$bullet;/g,
                                      ""
                                    )
                                  : ""}{" "}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { expansionId, dungeonId } = context.params;
  const { API_BATTLENET_KEY, API_BATTLENET_SECRET } = process.env;

  try {

    // Fetch dungeon data and find the selected dungeon
    const dungeonData = await fetchDungeonsByExpansion(expansionId);
    const dungeon = dungeonData.dungeons.find(
      (dungeon) => dungeon.id === parseInt(dungeonId)
    );

    // Fetch dungeon media and details
    const dungeonMedia = await getDungeonMedia(dungeonId);
    const dungeonDetails = await getDungeonDetails(dungeonId);

    return {
      props: {
        dungeonData: dungeon,
        dungeonMedia,
        dungeonDetails,
      },
    };
  } catch (error) {
    console.error("Error fetching dungeon:", error);
    return {
      props: {
        dungeonData: null,
        dungeonMedia: null,
        dungeonDetails: null,
      },
    };
  }
}

export default DungeonPage;
