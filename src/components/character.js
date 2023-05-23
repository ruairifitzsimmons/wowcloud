import { getCharacter, getRealms } from '../utils/api';
import { useEffect, useState } from 'react';

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
          setRealms(realmsData.realms); // Set the realms state with the fetched data
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
        const response = await getCharacter(selectedRealm, characterName);
        setCharacterData(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
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
              {characterData.character_class.name}
            </span>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
