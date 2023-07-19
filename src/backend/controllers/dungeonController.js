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
    // Instead of just passing the error message, pass the entire error object.
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

module.exports = {
  fetchDungeonsByExpansion,
  getDungeonMedia, // Export the new function
};
