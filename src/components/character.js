import { getCharacter, getRealms, getCharacterEquipment, getCharacterEquipmentMedia, getCharacterMedia } from '../utils/api';
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
      <div className={styles.searchContainer}>
        <form onSubmit={handleSearch}>
          <select
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
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter character name"
          />
          <button type="submit">Search</button>
        </form>
      </div>
      
      {characterData && (

        <div className={styles.mainContainer}>
          <div className={styles.character}>
            <div className={styles.characterContainer}>
              <div>
                <span className={styles.characterName}>{characterData.name}</span>
              </div>
              <div>
                <span className={styles.characterMetadata}>
                  {characterData.level}&nbsp;
                  {characterData.race.name}&nbsp;
                  {characterData.active_spec.name}&nbsp;
                  {characterData.character_class.name}&nbsp;
                </span>
              </div>
            </div>

            {characterData.assets && (
              <div>
                {/*{characterData.assets.map((asset, index) => (
                  <img key={index} src={asset.value} alt={asset.key} />
                ))}*/}
                <img className={styles.characterImage} src={characterData.assets[2].value}/>
              </div>
            )}

            {characterData.equipment && characterData.media && (
              <div>
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
