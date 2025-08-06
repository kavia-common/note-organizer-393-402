const notesService = require('../services/notes');
const authService = require('../services/auth');

// PUBLIC_INTERFACE
/**
 * Get notes for user (optional: search, tag, category)
 */
async function list(req, res) {
  try {
    const { search, categoryId, tag } = req.query;
    const userId = req.user.sub;
    const notes = await notesService.getNotes(userId, {
      search,
      categoryId,
      tag,
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * Get single note
 */
async function get(req, res) {
  try {
    const userId = req.user.sub;
    const noteId = parseInt(req.params.id, 10);
    const note = await notesService.getNoteById(userId, noteId);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * Create new note
 */
async function create(req, res) {
  try {
    const userId = req.user.sub;
    const { title, content, categoryId, tags } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
    const note = await notesService.createNote(userId, title, content, categoryId, tags || []);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * Update note
 */
async function update(req, res) {
  try {
    const userId = req.user.sub;
    const noteId = parseInt(req.params.id, 10);
    const { title, content, categoryId, tags } = req.body;
    const note = await notesService.updateNote(userId, noteId, {
      title,
      content,
      categoryId,
      tagNames: tags,
    });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * Delete note
 */
async function remove(req, res) {
  try {
    const userId = req.user.sub;
    const noteId = parseInt(req.params.id, 10);
    const deleted = await notesService.deleteNote(userId, noteId);
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * List all tags used in this user's notes
 */
async function tags(req, res) {
  try {
    const userId = req.user.sub;
    const result = await notesService.getUserTags(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
/**
 * List all categories of user
 */
async function categories(req, res) {
  try {
    const userId = req.user.sub;
    const categories = await notesService.getCategories(userId);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Create a category for user
 */
async function createCategory(req, res) {
  try {
    const userId = req.user.sub;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name required' });
    const cat = await notesService.createCategory(userId, name);
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Update a user's category
 */
async function updateCategory(req, res) {
  try {
    const userId = req.user.sub;
    const categoryId = parseInt(req.params.categoryId, 10);
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name required' });
    const cat = await notesService.updateCategory(userId, categoryId, name);
    res.json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Delete a user's category
 */
async function deleteCategory(req, res) {
  try {
    const userId = req.user.sub;
    const categoryId = parseInt(req.params.categoryId, 10);
    const deleted = await notesService.deleteCategory(userId, categoryId);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
  tags,
  categories,
  createCategory,
  updateCategory,
  deleteCategory,
};

