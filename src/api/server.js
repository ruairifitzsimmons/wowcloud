const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 9000;
app.use(cors());

// DUNGEONS
app.get('/api/dungeons', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(
            'https://eu.api.blizzard.com/data/wow/journal-instance/index?namespace=static-eu&locale=en_GB',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching dungeons: ', error);
        res.status(500).json({ error: 'An error occured' });
    }
});

app.get('/api/realms', async (req, res) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `https://eu.api.blizzard.com/data/wow/realm/index?namespace=dynamic-eu&locale=en_GB`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching realms: ', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

//CHARACTER
app.get('/api/character', async (req, res) => {
    const { realm, characterName } = req.query; // Retrieve realm and characterName from query parameters
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(
            `https://eu.api.blizzard.com/profile/wow/character/${realm}/${characterName}?namespace=profile-eu&locale=en_GB`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching character: ', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

async function getAccessToken() {
    try {
        const response = await axios.post(
            //'https://eu.battle.net/oauth/token?grant_type=client_credentials&client_id=ce8df521280e4df6b47cda395335bc69&client_secret=HMA8Tj1jPlkfwizZZ1MaE35D2YVCiGhF'
            `https://eu.battle.net/oauth/token?grant_type=client_credentials&client_id=${process.env.API_BATTLENET_KEY}&client_secret=${process.env.API_BATTLENET_SECRET}`,
        );
        console.log(response.data);
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token: ', error);
        throw error;
    }
}