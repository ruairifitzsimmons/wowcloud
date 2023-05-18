import axios from 'axios';

const CLIENT_ID = 'ce8df521280e4df6b47cda395335bc69';
const CLIENT_SECRET = 'HMA8Tj1jPlkfwizZZ1MaE35D2YVCiGhF';
const BASE_URL = 'https://eu.api.blizzard.com';

export async function getDungeons() {
    try {
        const response = await axios.get(
            `${BASE_URL}/data/wow/journal-instance/index?namespace=static-eu&locale=en_GB`,
            {
                headers: {
                    Authorization: `Bearer ${await getAccessToken()}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching dungeons:', error);
        throw error;
    }
}

async function getAccessToken() {
    try {
        const response = await axios.post(
            `https://eu.battle.net/oauth/token`,
            `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
        )

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}