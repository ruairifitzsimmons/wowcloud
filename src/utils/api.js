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

export async function getRealms() {
  try {
    const response = await axios.get(`${BASE_URL}/realms`);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error fetching realms: ', error);
    throw error;
  }
}

export async function getCharacter(realm, characterName) {
  try {
    const response = await axios.get(`${BASE_URL}/character`, {
      params: {
        realm,
        characterName,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching character: ', error);
    throw error;
  }
}

export async function getCharacterMedia(realm, characterName) {
  try {
    const response = await axios.get(`${BASE_URL}/character-media`, {
        params: {
          realm,
          characterName,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching character media: ', error);
    throw error;
  }
}

export async function getCharacterEquipment(realm, characterName) {
  try {
    const response = await axios.get(`${BASE_URL}/character-equipment`, {
      params: {
        realm,
        characterName,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching character: ', error);
    throw error;
  }
}

export async function getCharacterEquipmentMedia(itemid) {
  try {
    const response = await axios.get(`${BASE_URL}/character-equipment-media`, {
      params: {
        itemid,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment media: ', error);
    throw error;
  }
}