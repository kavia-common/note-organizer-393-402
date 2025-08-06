const express = require('express');
const controller = require('../controllers/notes');
const { requireAuth } = require('../services/auth');

const router = express.Router();

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes (optionally filter by search/tag/category)
 *   post:
 *     summary: Create a note
 */
router.get('/', requireAuth, controller.list);
router.post('/', requireAuth, controller.create);

/**
 * @swagger
 * /notes/:id:
 *   get:
 *     summary: Get a note by ID
 *   put:
 *     summary: Update a note
 *   delete:
 *     summary: Delete a note
 */
router.get('/:id', requireAuth, controller.get);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);

/**
 * @swagger
 * /notes/tags:
 *   get:
 *     summary: Get all tags of current user
 */
router.get('/tags/all', requireAuth, controller.tags);

/**
 * @swagger
 * /notes/categories:
 *   get:
 *     summary: Get all categories of current user
 *   post:
 *     summary: Create a category
 */
router.get('/categories/all', requireAuth, controller.categories);
router.post('/categories', requireAuth, controller.createCategory);

router.put('/categories/:categoryId', requireAuth, controller.updateCategory);
router.delete('/categories/:categoryId', requireAuth, controller.deleteCategory);

module.exports = router;

