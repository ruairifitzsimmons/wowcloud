const axios = require('axios');
const BASE_URL = 'http://localhost:9000/api';

{/*async function getDungeons() {
  try {
      const response = await axios.get(`${BASE_URL}/dungeons`);
      return response.data;
  } catch (error) {
      console.error('Error fetching dungeons: ', error);
      throw error;
  }
}*/}

async function getDungeons(expansionId) {
  try {
    const url = expansionId ? `${BASE_URL}/dungeons/${expansionId}` : `${BASE_URL}/dungeons`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching dungeons: ', error);
    throw error;
  }
}

async function getDungeonDetails(req, res) {
  try {
    const { dungeonId } = req.params;
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `https://eu.api.blizzard.com/data/wow/journal-instance/${dungeonId}`,
      {
        params: {
          namespace: 'static-10.1.5_50232-eu', // Update the namespace to 'static-10.1.5_50232-eu'
          locale: 'en_GB',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const dungeonDetails = response.data;

    res.json(dungeonDetails);
  } catch (error) {
    console.error('Error fetching dungeon details: ', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}



async function getRealms() {
  try {
    const response = await axios.get(`${BASE_URL}/realms`);
    return response.data;
  } catch (error) {
    console.error('Error fetching realms: ', error);
    throw error;
  }
}

async function getCharacter(realm, characterName) {
  try {
    const response = await axios.get(`${BASE_URL}/character`, {
      params: {
        realm,
        characterName,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching character: ', error);
    throw error;
  }
}

async function getCharacterMedia(realm, characterName) {
  try {
    const response = await axios.get(`${BASE_URL}/character-media`, {
        params: {
          realm,
          characterName,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching character media: ', error);
    throw error;
  }
}

async function getCharacterEquipment(realm, characterName) {
  try {
    const response = await axios.get(`${BASE_URL}/character-equipment`, {
      params: {
        realm,
        characterName,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching character: ', error);
    throw error;
  }
}

async function getCharacterEquipmentMedia(itemid) {
  try {
    const response = await axios.get(`${BASE_URL}/character-equipment-media`, {
      params: {
        itemid,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment media: ', error);
    throw error;
  }
}

async function getCharacterStatistics(realm, characterName) {
  try {
    const response = await axios.get(`${BASE_URL}/character-statistics`, {
      params: {
        realm,
        characterName,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching character: ', error);
    throw error;
  }
}

module.exports = {
  getDungeons,
  getRealms,
  getCharacter,
  getCharacterMedia,
  getCharacterEquipment,
  getCharacterEquipmentMedia,
  getCharacterStatistics,
  getDungeonDetails
};