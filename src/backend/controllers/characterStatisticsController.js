const axios = require('axios');
const { getAccessToken } = require('../utils/accessToken');

async function getCharacterStatistics(req, res) {
  const { realm, characterName } = req.query;
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://eu.api.blizzard.com/profile/wow/character/${realm}/${characterName}/statistics`,
      {
        params: {
          namespace: 'profile-eu',
          locale: 'en_GB',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching character statistics: ', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {
  getCharacterStatistics,
};