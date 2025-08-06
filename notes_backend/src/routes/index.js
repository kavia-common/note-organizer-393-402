const express = require('express');
const healthController = require('../controllers/health');
const authRoutes = require('./auth');
const notesRoutes = require('./notes');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 */
router.get('/', healthController.check.bind(healthController));

// Authentication endpoints
router.use('/auth', authRoutes);

// Notes endpoints
router.use('/notes', notesRoutes);

module.exports = router;
