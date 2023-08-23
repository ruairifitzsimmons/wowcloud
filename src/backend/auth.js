const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
  };
  const options = {
    expiresIn: '24h'
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
  
      req.user = decoded;
      next();
    });
}

function storeToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

function hasToken() {
  return localStorage.getItem('token') !== null;
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePasswords(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = {
  generateToken,
  authenticateToken,
  storeToken,
  removeToken,
  hasToken,
  hashPassword,
  comparePasswords
};
