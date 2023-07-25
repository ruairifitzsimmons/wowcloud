const axios = require('axios');
const { getAccessToken } = require('../utils/accessToken');

async function fetchDungeonsByExpansion(expansionId) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://eu.api.blizzard.com/data/wow/journal-expansion/${expansionId}`,
      {
        params: {
          namespace: 'static-eu',
          locale: 'en_GB',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const dungeonsData = response.data;
    return dungeonsData;
  } catch (error) {
    throw error;
  }
}

async function getDungeonMedia(dungeonId) {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `https://eu.api.blizzard.com/data/wow/media/journal-instance/${dungeonId}`,
      {
        params: {
          namespace: 'static-eu',
          locale: 'en_GB',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const dungeonMedia = response.data;

    return dungeonMedia;
  } catch (error) {
    throw error;
  }
}

async function getDungeonDetails(dungeonId) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://eu.api.blizzard.com/data/wow/journal-instance/${dungeonId}`,
      {
        params: {
          namespace: `static-eu`,
          locale: 'en_GB',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const dungeonDetails = response.data;
    return dungeonDetails;
  } catch (error) {
    console.error('Error fetching dungeon details: ', error);
    throw error;
  }
}

async function getEncounterDetails(encounterId) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://eu.api.blizzard.com/data/wow/journal-encounter/${encounterId}`,
      {
        params: {
          namespace: `static-eu`,
          locale: 'en_GB',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const encounterDetails = response.data;
    return encounterDetails;
  } catch (error) {
    console.error('Error fetching encounter details: ', error);
    throw error;
  }
}

async function getItemInformation(itemId) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://eu.api.blizzard.com/data/wow/item/${itemId}`,
      {
        params: {
          namespace: `static-eu`,
          locale: 'en_GB',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const itemInformation = response.data;
    return itemInformation;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Item with ID ${itemId} not found.`);
    } else {
      console.error('Error fetching item information:', error);
    }
    throw error;
  }
}

async function getItemMedia(itemId) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://eu.api.blizzard.com/data/wow/media/item/${itemId}`,
      {
        params: {
          namespace: `static-eu`,
          locale: 'en_GB',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const itemMedia = response.data;
    return itemMedia;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Item media with ID ${itemId} not found.`);
    } else {
      console.error('Error fetching item media:', error);
    }
    throw error;
  }
}

module.exports = {
  fetchDungeonsByExpansion,
  getDungeonMedia,
  getDungeonDetails,
  getEncounterDetails,
  getItemInformation,
  getItemMedia,
};