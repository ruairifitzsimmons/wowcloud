const axios = require('axios');
const { getAccessToken } = require('../utils/accessToken');

async function getDungeons(req, res) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get('https://eu.api.blizzard.com/data/wow/journal-instance/index', {
      params: {
        namespace: 'static-eu',
        locale: 'en_GB',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching dungeons: ', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {
  getDungeons,
};