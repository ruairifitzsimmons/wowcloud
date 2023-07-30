/* eslint-disable @next/next/no-img-element */
import { getCharacter, getRealms, getCharacterEquipment, getCharacterEquipmentMedia, getCharacterMedia, getCharacterStatistics } from '../backend/utils/blizzardApi';
import { useEffect, useState } from 'react';
import styles from '../styles/character.module.css';
import EquippedItem from './equippedItem';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faStar, faShieldHalved } from '@fortawesome/free-solid-svg-icons';

export default function CharacterSearch({initialRealmSlug, initialCharacterName}) {
  const [realms, setRealms] = useState([]);
  const [selectedRealm, setSelectedRealm] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [characterData, setCharacterData] = useState(null);
  const [characterStatistics, setCharacterStatistics] = useState(null);
  const [showStatisticsPopup, setShowStatisticsPopup] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkedCharacters, setBookmarkedCharacters] = useState([]);
  const [characterNameInput, setCharacterNameInput] = useState('');

  // Fetch bookmarked characters from the server
  const fetchBookmarkedCharacters = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:9000/api/bookmarks', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      setBookmarkedCharacters(response.data);
    } catch (error) {
      console.error('Error fetching bookmarked characters:', error);
    }
  };

  const fetchCharacterData = async (selectedRealm, characterName) => {
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
  
        const characterStatisticsResponse = await getCharacterStatistics(selectedRealm, characterName);
        setCharacterStatistics(characterStatisticsResponse);
  
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchRealms = async () => {
      try {
        const realmsData = await getRealms();
        if (realmsData && realmsData.realms) {
          const sortedRealms = realmsData.realms.sort((a, b) => a.name.localeCompare(b.name));
          setRealms(sortedRealms);
        } else {
          console.error('Invalid realms data');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRealms();
    fetchBookmarkedCharacters();
  }, []);
  
  useEffect(() => {
    if (initialRealmSlug && initialCharacterName) {
      setSelectedRealm(initialRealmSlug);
      setCharacterName(initialCharacterName);
      fetchCharacterData(initialRealmSlug, initialCharacterName);
    }
  }, [initialRealmSlug, initialCharacterName]);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    // Fetch character data
    await fetchCharacterData(selectedRealm, characterNameInput);

    // Update the URL using the History API
    const searchParams = new URLSearchParams();
    searchParams.append('realmSlug', selectedRealm);
    searchParams.append('characterName', characterNameInput);

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    setCharacterName(characterNameInput);
  };

  const handleBookmark = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found. User is not authenticated.');
      return;
    }

    try {
      const currentUrl = window.location.href;

      if (!isBookmarked) {
        await axios.post(
          `http://localhost:9000/api/bookmarks/save`,
          {
            url: currentUrl,
            realm: selectedRealm,
            character: characterName,
          },
          {
            headers: {
              'Authorization': token,
              'Content-Type': 'application/json',
            },
          }
        );
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error handling bookmark:', error);
    }
  };

  const handleToggleStatisticsPopup = () => {
    setShowStatisticsPopup(!showStatisticsPopup);
  };

   // Function to get the CSS class for the character's class
   const getCharacterClass = (characterClass) => {
    switch (characterClass) {
      case 'Paladin':
        return styles.paladin;
      case 'Mage':
        return styles.mage;
      case 'Rogue':
        return styles.rogue;
      case 'Death Knight':
        return styles.deathknight;
      case 'Demon Hunter':
        return styles.demonhunter;
      case 'Hunter':
        return styles.hunter;
      case 'Warrior':
        return styles.warrior;
      case 'Warlock':
        return styles.warlock;
      case 'Priest':
        return styles.priest;
      case 'Shaman':
        return styles.shaman;
      case 'Druid':
        return styles.druid;
      case 'Evoker':
        return styles.evoker;
      case 'Monk':
        return styles.monk;
      // Add more cases for other character classes if needed
      default:
        return 'characterImageContainer'; // Fallback class with default image
    }
  };

  // Function to get the CSS class for the character's power type
  const getPowerTypeClass = (powerType) => {
    switch (powerType) {
      case 'Rage':
        return styles.rage;
      case 'Energy':
        return styles.energy;
      case 'Insanity':
        return styles.insanity;
      case 'Fury':
        return styles.fury;
      case 'Focus':
        return styles.focus;
      default:
        return styles.characterPower; // Default class for common power types
    }
  };

  // Check if the character is already bookmarked
  useEffect(() => {
    setIsBookmarked(bookmarkedCharacters.some((character) => {
      return character.realm === selectedRealm && character.character === characterName;
    }));
  }, [selectedRealm, characterName, bookmarkedCharacters]);

  
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
              value={characterNameInput}
              onChange={(e) => setCharacterNameInput(e.target.value)}
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
                  <FontAwesomeIcon
                    icon={faEye}
                    className={styles.showStatisticsButton}
                    onClick={() => setShowStatisticsPopup(!showStatisticsPopup)}
                  />
                </div>
                {/* Bookmark Button */}
                {!isBookmarked && (
                    <button
                      className={`${styles.bookmarkButton} ${isBookmarked ? styles.bookmarked : ''}`}
                      onClick={handleBookmark}
                    >
                      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                  )}
              </div>
            <div>
          </div>

            {characterData.assets && (
              <div className={`${styles.characterImageContainer} ${getCharacterClass(characterData.character_class.name)}`}>
                <img className={styles.characterImage} src={characterData.assets[2].value} alt='/' />
              </div>
            )}
            
            {characterData && characterData.equipment && characterData.media && characterStatistics && (
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
                    <span className={styles.statIcons}><FontAwesomeIcon icon={faStar}/>{characterData.achievement_points}</span>
                    <span className={styles.statIcons}><FontAwesomeIcon icon={faShieldHalved}/>{characterData.equipped_item_level}</span>
                  </div>

                  {/* Character Health & Power */}
                  <div className={styles.healthPower}>
                    <span className={styles.characterHealth}>{characterStatistics.health}</span>
                    <div className={`${styles.characterPower} ${getPowerTypeClass(characterStatistics.power_type.name)}`}>
                      {characterStatistics.power}
                    </div>
                  </div>

                  {/* Character Attributes */}
                  <div className={styles.characterAttributes}>
                    <span className={styles.characterAttribute}>Stamina: {characterStatistics.stamina.base}</span>
                    <span className={styles.characterAttribute}>Strength: {characterStatistics.strength.base}</span>
                    <span className={styles.characterAttribute}>Agility: {characterStatistics.agility.base}</span>
                    <span className={styles.characterAttribute}>Intellect: {characterStatistics.intellect.base}</span>
                    <span className={styles.characterAttribute}>Mastery: {characterStatistics.mastery.rating}</span>
                    <span className={styles.characterAttribute}>Versatility: {characterStatistics.versatility}</span>
                  </div>

                </div>

                {showStatisticsPopup && (
                <div className={styles.statisticsPopup}>
                  {/* Character Achievement Points & iLvl */}
                  <div className={styles.achievementilvl}>
                    <span className={styles.statIcons}><FontAwesomeIcon icon={faStar}/>{characterData.achievement_points}</span>
                    <span className={styles.statIcons}><FontAwesomeIcon icon={faShieldHalved}/>{characterData.equipped_item_level}</span>
                  </div>

                  {/* Character Health & Power */}
                  <div className={styles.healthPower}>
                  <span className={styles.characterHealth}>{characterStatistics.health}</span>
                  <div className={`${styles.characterPower} ${getPowerTypeClass(characterStatistics.power_type.name)}`}>
                      {characterStatistics.power}
                    </div>
                  </div>

                  {/* Character Attributes */}
                  <div className={styles.characterAttributes}>
                    <span className={styles.characterAttribute}>Stamina: {characterStatistics.stamina.base}</span>
                    <span className={styles.characterAttribute}>Strength: {characterStatistics.strength.base}</span>
                    <span className={styles.characterAttribute}>Agility: {characterStatistics.agility.base}</span>
                    <span className={styles.characterAttribute}>Intellect: {characterStatistics.intellect.base}</span>
                    <span className={styles.characterAttribute}>Mastery: {characterStatistics.mastery.rating}</span>
                    <span className={styles.characterAttribute}>Versatility: {characterStatistics.versatility}</span>
                  </div>
                </div>
              )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
