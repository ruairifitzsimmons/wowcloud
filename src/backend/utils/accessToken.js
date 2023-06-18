const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

async function getAccessToken() {
  try {
    const response = await axios.post(
      `https://eu.battle.net/oauth/token?grant_type=client_credentials&client_id=${process.env.API_BATTLENET_KEY}&client_secret=${process.env.API_BATTLENET_SECRET}`
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token: ', error);
    throw error;
  }
}

module.exports = {
  getAccessToken,
};
