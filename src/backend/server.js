const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const express = require('express');
const collection = require('./db')
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();  
//const dbRouter = require('./db');
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
//app.use('/api'/*, dbRouter*/);

// ROUTES
app.get('/api/dungeons', dungeonsController.getDungeons);
app.get('/api/realms', realmsController.getRealms);
app.get('/api/character', characterController.getCharacter);
app.get('/api/character-media', characterMediaController.getCharacterMedia);
app.get('/api/character-equipment', characterEquipmentController.getCharacterEquipment);
app.get('/api/character-equipment-media', characterEquipmentMediaController.getCharacterEquipmentMedia);
app.get('/api/character-statistics', characterStatisticsController.getCharacterStatistics);

app.get('/login', cors(), (req,res) => {
})

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await collection.findOne({ email: email });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        res.json('exist');
      } else {
        res.json('passwordincorrect');
      }
    } else {
      res.json('notexist');
    }
  } catch (e) {
    res.json('notexist');
  }
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  // Validate email format
  if (!emailRegex.test(email)) {
    res.json('invalidemail');
    return;
  }
  try {
    const check = await collection.findOne({ email: email });
    if (check) {
      res.json('exist');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await collection.insertMany([
        { email: email, password: hashedPassword },
      ]);
      res.json('notexist');
    }
  } catch (e) {
    res.status(500).json('error');
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});