const axios = require('axios');
const { getAccessToken } = require('../utils/accessToken');

async function getCharacterEquipmentMedia(req, res) {
  const { itemid } = req.query;
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get(
      `https://eu.api.blizzard.com/data/wow/media/item/${itemid}`,
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
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching equipment media: ', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {
  getCharacterEquipmentMedia,
};