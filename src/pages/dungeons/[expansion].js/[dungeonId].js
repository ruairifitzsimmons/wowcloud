const axios = require('axios');
const { getAccessToken } = require('../utils/accessToken');

async function getDungeonsByExpansion(req, res) {
  try {
    const { expansionId } = req.params;
    const accessToken = await getAccessToken();
console.log({expansionId})
    const response = await axios.get(
      `https://eu.api.blizzard.com/data/wow/journal-expansion/${expansionId}`,
      {
        params: {
          namespace: 'static-10.1.5_50232-eu',
          locale: 'en_GB',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Assuming the response.data contains the details of the expansion, not just the dungeons
    const expansionData = response.data;

    res.json(expansionData);
  } catch (error) {
    console.error('Error fetching dungeons by expansion: ', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function getDungeonDetails(req, res) {
  try {
    const { expansion, dungeonId } = req.params;
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `https://eu.api.blizzard.com/data/wow/journal-instance/${dungeonId}`,
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

    const dungeonDetails = response.data;

    res.json(dungeonDetails);
  } catch (error) {
    console.error('Error fetching dungeon details: ', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {
  getDungeonsByExpansion,
  getDungeonDetails,
};