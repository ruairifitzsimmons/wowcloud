const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });
const express = require('express');
const collection = require('./db')
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const port = 9000;
const auth = require('./auth');

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

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await collection.findOne({ email: email });
    if (user) {
      const isPasswordMatch = await auth.comparePasswords(password, user.password);
      if (isPasswordMatch) {
        const token = auth.generateToken(user);
        res.json({ token: token });
      } else {
        res.status(401).json({ message: 'Incorrect password' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Profile
app.get('/profile', auth.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await collection.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ email: user.email, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Profile
app.put('/profile', auth.authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const newUsername = req.body.username;
    const user = await collection.findByIdAndUpdate(userId, { username: newUsername }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register
app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
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
      const newUser = await collection.insertMany([
        { email: email, password: hashedPassword, username: username }, // Include the username field
      ]);
      const token = auth.generateToken(newUser[0]);
      res.json({ token: token });
    }
  } catch (e) {
    res.status(500).json('error');
  }
});

// Logout
app.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});