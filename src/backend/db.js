const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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

router.get('/user', (req, res) => {
  if (req.user) {
    // User is authenticated, return the user data
    res.json(req.user);
  } else {
    // User is not logged in
    res.sendStatus(401);
  }
});

// Initialize session middleware
router.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport middleware
router.use(passport.initialize());
router.use(passport.session());

// Configure Passport to use a LocalStrategy for authentication
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      // Find the user with the provided email
      const user = await User.findOne({ email });

      if (!user) {
        // User not found
        return done(null, false, { message: 'User not found' });
      }

      // Check if the password matches
      if (user.password !== password) {
        // Incorrect password
        return done(null, false, { message: 'Incorrect password' });
      }

      // User authenticated successfully
      return done(null, user);
    } catch (error) {
      console.error('Error:', error);
      return done(error);
    }
  })
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

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
  
// User login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
        console.error('Error:', err);
        return res.sendStatus(500); // Internal server error
        }
        if (!user) {
        // User not found or incorrect password
        return res.status(401).json({ error: info.message });
        }

        req.logIn(user, (err) => {
        if (err) {
            console.error('Error:', err);
            return res.sendStatus(500); // Internal server error
        }

        // User authenticated successfully
        res.sendStatus(200);
        });
    })(req, res, next);
});

module.exports = router; // Export the router