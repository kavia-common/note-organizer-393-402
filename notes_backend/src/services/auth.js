/* Auth service for handling authentication logic (hash, verify, JWT) */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// PUBLIC_INTERFACE
/**
 * Registers a new user with email and hashed password.
 */
async function signup(email, password) {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new Error('Email already registered');
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash });
  return user;
}

// PUBLIC_INTERFACE
/**
 * Authenticates a user and returns JWT token.
 */
async function login(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error('Invalid credentials');
  // Payload: user.id
  const payload = { sub: user.id, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  return { user, token };
}

// PUBLIC_INTERFACE
/**
 * Middleware to authenticate JWT and attach user to req.
 */
function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const [bearer, token] = header.split(' ');
  if (bearer !== 'Bearer' || !token) return res.status(401).json({ error: 'Invalid token format' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// PUBLIC_INTERFACE
/**
 * Get currently authed user model.
 */
async function getCurrentUser(req) {
  if (!req.user || !req.user.sub) return null;
  return await User.findByPk(req.user.sub);
}

module.exports = { signup, login, requireAuth, getCurrentUser };

