const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Generates a JWT token
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
  };
  const options = {
    // Token expiration time
    expiresIn: '1h'
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
  
      req.user = decoded; // Attach the decoded user object to req.user
      next();
    });
  }

// Hashes the password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compares the password with the hashed password
async function comparePasswords(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = {
  generateToken,
  authenticateToken,
  hashPassword,
  comparePasswords
};
