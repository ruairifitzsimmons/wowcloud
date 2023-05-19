const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 9000;

app.use(cors());

app.get('/api/dungeons', async (req, res) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(
            `https://eu.api.blizzard.com/data/wow/journal-instance/index?namespace=static-eu&locale=en_GB`,
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

async function getAccessToken() {
    try {
        const response = await axios.post(
            `https://us.battle.net/oauth/token`,
            null,
            {
                params: {
                    grant_type: 'client_credentials',
                    client_id: process.env.API_BATTLENET_KEY,
                    client_secret: process.env.API_BATTLENET_SECRET,
                }
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token: ', error);
        throw error;
    }
}