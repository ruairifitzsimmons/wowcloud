const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const express = require('express');
const cors = require('cors');
const app = express();  
const dbRouter = require('./db');
const port = 9000;

// CONTROLLERS
const dungeonsController = require('./controllers/dungeonController');
const realmsController = require('./controllers/realmsController');
const characterController = require('./controllers/characterController');
const characterMediaController = require('./controllers/characterMediaController');
const characterEquipmentController = require('./controllers/characterEquipmentController');
const characterEquipmentMediaController = require('./controllers/characterEquipmentMediaController');
const characterStatisticsController = require('./controllers/characterStatisticsController');

app.use(cors());
app.use(express.json());
app.use('/api', dbRouter);

// ROUTES
app.get('/api/dungeons', dungeonsController.getDungeons);
app.get('/api/realms', realmsController.getRealms);
app.get('/api/character', characterController.getCharacter);
app.get('/api/character-media', characterMediaController.getCharacterMedia);
app.get('/api/character-equipment', characterEquipmentController.getCharacterEquipment);
app.get('/api/character-equipment-media', characterEquipmentMediaController.getCharacterEquipmentMedia);
app.get('/api/character-statistics', characterStatisticsController.getCharacterStatistics);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});