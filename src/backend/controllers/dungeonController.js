// dungeonController.js
const axios = require('axios');
const { getAccessToken } = require('../utils/accessToken');

async function getDungeonsByExpansion(req, res) {
  const { expansionId } = req.params;
  try {
    const accessToken = await getAccessToken();

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

module.exports = {
  getDungeonsByExpansion,
};
  