const axios = require('axios');
const { getAccessToken } = require('../utils/accessToken');

async function getRealms(req, res) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(`https://eu.api.blizzard.com/data/wow/realm/index`, {
      params: {
        namespace: 'dynamic-eu',
        locale: 'en_GB',
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching realms: ', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {
  getRealms,
};