/* eslint-disable @next/next/no-img-element */
import { getCharacter, getRealms, getCharacterEquipment, getCharacterEquipmentMedia } from '../utils/api';
import { useEffect, useState } from 'react';
import styles from '../styles/character.module.css';

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
        const [characterResponse, equipmentResponse] = await Promise.all([
          getCharacter(selectedRealm, characterName),
          getCharacterEquipment(selectedRealm, characterName),
        ]);

        console.log('Equipment Response:', equipmentResponse);

        const characterDataWithEquipment = {
          ...characterResponse,
          equipment: equipmentResponse,
        };

        setCharacterData(characterDataWithEquipment);

        if (equipmentResponse.equipped_items.length > 0) {
          const equippedItems = equipmentResponse.equipped_items;
          const mediaPromises = equippedItems.map((item) =>
            getCharacterEquipmentMedia(item.media.id)
          );

          const mediaResponses = await Promise.all(mediaPromises);
          console.log('Media Responses:', mediaResponses);

          const characterDataWithMedia = {
            ...characterDataWithEquipment,
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
    <div>
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
        <div>
          <div>
            <div>
              <span>{characterData.name}</span>
            </div>
            <div>
              <span>
                -{characterData.achievement_points}
                -{characterData.equipped_item_level}
              </span>
            </div>
            <div>
              <span>
                {characterData.level}&nbsp;
                {characterData.race.name}&nbsp;
                {characterData.active_spec.name}&nbsp;
                {characterData.character_class.name}&nbsp;
              </span>
            </div>
          </div>

          {characterData.equipment && characterData.media && (
            <div>
              {characterData.equipment.equipped_items.length > 0 && (
                <div className={styles.item}>
                  {/* ITEM THUMBNAIL */}
                  {characterData.media[0] &&
                    characterData.media[0].assets &&
                    characterData.media[0].assets.length > 0 && (
                      <img
                        className={styles.itemimage}
                        src={characterData.media[0].assets[0].value}
                        alt="Equipment Media"
                      />
                    )}

                  {/* ITEM DETAILS */}
                  <div className={styles.iteminfo}>
                    <span className={styles.itemname}>
                      {characterData.equipment.equipped_items[0].name}
                    </span>
                    <span>
                      {characterData.equipment.equipped_items[0].slot.name}
                    </span>
                  </div>
                </div>
              )}

              {characterData.equipment.equipped_items.length > 1 && (
                <div className={styles.item}>
                  {/* ITEM THUMBNAIL */}
                  {characterData.media[1] &&
                    characterData.media[1].assets &&
                    characterData.media[1].assets.length > 0 && (
                      <img
                        className={styles.itemimage}
                        src={characterData.media[1].assets[0].value}
                        alt="Equipment Media"
                      />
                    )}

                  {/* ITEM DETAILS */}
                  <div className={styles.iteminfo}>
                    <span className={styles.itemname}>
                      {characterData.equipment.equipped_items[1].name}
                    </span>
                    <span>
                      {characterData.equipment.equipped_items[1].slot.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
