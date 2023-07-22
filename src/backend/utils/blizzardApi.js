const axios = require('axios');
const BASE_URL = 'http://localhost:9000/api';

async function getDungeons(expansionId, dungeonId) {
  try {
    const url = dungeonId ? `${BASE_URL}/dungeons/${expansionId}/${dungeonId}` : `${BASE_URL}/dungeons/${expansionId}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching dungeons: ', error);
    throw error;
  }
}

async function getDungeonMedia(expansionId, dungeonId) {
  try {
    const url = `${BASE_URL}/media/journal-instance/${dungeonId}`;
    const response = await axios.get(url, {
      params: {
        namespace: `static-${expansionId}_eu`,
        locale: 'en_GB',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dungeon media:', error);
    throw error;
  }
}

async function getItemInformation(itemId) {
  try {
    const response = await axios.get(`${BASE_URL}/item/${itemId}`, {
      params: {
        namespace: 'static-eu',
        locale: 'en_GB',
      },
    });
    const itemDetails = response.data;
    return itemDetails;
  } catch (error) {
    console.error('Error fetching item details: ', error);
    throw error;
  }
}

async function getItemMedia(itemId) {
  try {
    const response = await axios.get(`${BASE_URL}/item-media/${itemId}`, {
      params: {
        namespace: 'static-eu',
        locale: 'en_GB',
      },
    });
    const itemMedia = response.data;
    return itemMedia;
  } catch (error) {
    console.error('Error fetching item media: ', error);
    throw error;
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
  getDungeonDetails,
  getDungeonMedia,
  getItemInformation,
  getItemMedia,
};