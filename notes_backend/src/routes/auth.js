const express = require('express');
const controller = require('../controllers/auth');
const { requireAuth } = require('../services/auth');

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 */
router.post('/signup', controller.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get JWT token
 */
router.post('/login', controller.login);

/**
 * @swagger
 * /auth/whoami:
 *   get:
 *     summary: Get current authenticated user
 */
router.get('/whoami', requireAuth, controller.whoami);

module.exports = router;

