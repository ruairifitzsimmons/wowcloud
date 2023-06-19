/* eslint-disable @next/next/no-img-element */
import { getCharacter, getRealms, getCharacterEquipment, getCharacterEquipmentMedia, getCharacterMedia, getCharacterStatistics } from '../backend/utils/blizzardApi';
import { useEffect, useState } from 'react';
import styles from '../styles/character.module.css';
import EquippedItem from './equippedItem';


export default function CharacterSearch() {
  const [realms, setRealms] = useState([]);
  const [selectedRealm, setSelectedRealm] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [characterData, setCharacterData] = useState(null);

  useEffect(() => {
    const fetchRealms = async () => {
      try {
        const realmsData = await getRealms();
        if (realmsData && realmsData.realms) {
          setRealms(realmsData.realms);
        } else {
          console.error('Invalid realms data');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRealms();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      if (selectedRealm && characterName) {
        const [characterResponse, equipmentResponse, characterMediaResponse] = await Promise.all([
          getCharacter(selectedRealm, characterName),
          getCharacterEquipment(selectedRealm, characterName),
          getCharacterMedia(selectedRealm, characterName),
        ]);

        const characterDataWithEquipment = {
          ...characterResponse,
          equipment: equipmentResponse,
        };
        
        setCharacterData(characterDataWithEquipment);

        const characterDataWithCharacterMedia = {
          ...characterDataWithEquipment,
          assets: characterMediaResponse.assets || [],
        };
  
        setCharacterData(characterDataWithCharacterMedia);

        if (equipmentResponse.equipped_items.length > 0) {
          const equippedItems = equipmentResponse.equipped_items;
          const mediaPromises = equippedItems.map((item) =>
            getCharacterEquipmentMedia(item.media.id)
          );

          const mediaResponses = await Promise.all(mediaPromises);

          const characterDataWithMedia = {
            ...characterDataWithCharacterMedia,
            media: mediaResponses,
          };

          setCharacterData(characterDataWithMedia);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        {/* Form */}
        <div className={styles.formContainer}>
        <form className={styles.searchContainer} onSubmit={handleSearch}>

          {/* Realm Select */}
          <select
            className={styles.searchSelect}
            value={selectedRealm}
            onChange={(e) => setSelectedRealm(e.target.value)}
          >
            <option value="">Select Realm</option>
            {realms &&
              realms.map((realm) => (
                <option key={realm.id} value={realm.slug}>
                  {realm.name}
                </option>
              ))}
          </select>

          {/* Character Input */}
          <input
            className={styles.searchInput}
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter character name"
          />

          {/* Search Button */}
          <button className={styles.searchButton} type="submit">Search</button>

        </form>
        </div>
      </div>

      {/* Character Container */}
      <div className={styles.mainContainer}>
        {characterData && (
          <div className={styles.character}>

            {/* Character Metadata */}
            <div className={styles.characterContainer}>
                <span className={styles.characterName}>{characterData.name}</span>
                <div>
                  <span className={styles.characterMetadata}>
                    {characterData.level}&nbsp;
                    {characterData.race.name}&nbsp;
                    {characterData.active_spec.name}&nbsp;
                    {characterData.character_class.name}&nbsp;
                  </span>
                </div>
            </div>

            {/* Character Image */}
            {characterData.assets && (
              <div className={styles.characterImageContainer}>
                <img className={styles.characterImage} src={characterData.assets[2].value} alt='/'/>
              </div>
            )}

            {characterData && characterData.equipment && characterData.media && (
              <div className={styles.characterDetailsContainer}>

                {/* Character Equipped Items */}
                {characterData.equipment && characterData.media && (
                  <div className={styles.equippeditem}>
                    {characterData.equipment.equipped_items.map((item, index) => (
                      <EquippedItem
                        key={index}
                        item={item}
                        media={characterData.media[index]}
                      />
                    ))}
                  </div>
                )}

                {/* Character Statistics */}
                <div className={styles.characterStatistics}>

                  {/* Character Achievement Points & iLvl */}
                  <div className={styles.achievementilvl}>
                    <span>*{characterData.achievement_points}</span>
                    <span>^{characterData.equipped_item_level}</span>
                  </div>

                  {/* Character Health & Power */}
                  <div className={styles.healthPower}>
                  <span className={styles.characterHealth}>Health: </span>
                  <span className={styles.characterPower}>Power: </span>
                  </div>

                  {/* Character Attributes */}
                  <div className={styles.characterAttributes}>
                    <span>Stamina:</span>
                    <span>Strength:</span>
                    <span>Agility:</span>
                    <span>Intellect:</span>
                    <span>Mastery:</span>
                    <span>Versatility:</span>
                  </div>

                </div> 
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
