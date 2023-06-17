const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();  
const dbRouter = require('./db'); // Import the router from db.js
const port = 9000;
app.use(cors());
app.use(express.json());
app.use('/api', dbRouter); // Mount the app instance from db.js under the '/api' path


// DUNGEONS
app.get('/api/dungeons', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(
            'https://eu.api.blizzard.com/data/wow/journal-instance/index',
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
        console.error('Error fetching dungeons: ', error);
        res.status(500).json({ error: 'An error occured' });
    }
});

// REALMS
app.get('/api/realms', async (req, res) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `https://eu.api.blizzard.com/data/wow/realm/index`,
        {
            params: {
                namespace: 'dynamic-eu',
                locale: 'en_GB',
            },
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
    const { realm, characterName } = req.query;
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(
            `https://eu.api.blizzard.com/profile/wow/character/${realm}/${characterName}`,
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
        console.error('Error fetching character: ', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// CHARACTER MEDIA
app.get('/api/character-media', async (req, res) => {
    const { realm, characterName } = req.query;
    try {
      const accessToken = await getAccessToken();
      const response = await axios.get(
        `https://eu.api.blizzard.com/profile/wow/character/${realm}/${characterName}/character-media`,
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
      console.error('Error fetching character media: ', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

// CHARACTER EQUIPMENT
app.get('/api/character-equipment', async (req, res) => {
    const { realm, characterName } = req.query;
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(
            `https://eu.api.blizzard.com/profile/wow/character/${realm}/${characterName}/equipment`,
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
        console.error('Error fetching character: ', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// CHARACTER EQUIPMENT MEDIA
app.get('/api/character-equipment-media', async (req, res) => {
    const { itemid } = req.query;
    //190522
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(
            `https://eu.api.blizzard.com/data/wow/media/item/${itemid}`,
            //`https://eu.api.blizzard.com/data/wow/media/item/190522`,
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
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// ACCESS TOKEN
async function getAccessToken() {
    try {
        const response = await axios.post(
            `https://eu.battle.net/oauth/token?grant_type=client_credentials&client_id=${process.env.API_BATTLENET_KEY}&client_secret=${process.env.API_BATTLENET_SECRET}`,
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token: ', error);
        throw error;
    }
}