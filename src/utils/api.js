import axios from 'axios';

const BASE_URL = 'http://localhost:9000/api';

export async function getDungeons() {
    try {
        const response = await axios.get(`${BASE_URL}/dungeons`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dungeons: ', error);
        throw error;
    }
}