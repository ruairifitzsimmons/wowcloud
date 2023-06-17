const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const connectionStr = 'mongodb+srv://ruairi:22%26Ht%25Lx4BDv@atlascluster.nqapa88.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(connectionStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.log(err));

// Middleware to parse JSON
router.use(express.json());

// Create a user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password,
    });
    console.log('Received newUser:', newUser);

    // Save the user to the database
    await newUser.save();

    res.sendStatus(201); // User created successfully
  } catch (error) {
    console.error('Error:', error);
    res.sendStatus(500); // Internal server error
  }
});

module.exports = router; // Export the router
