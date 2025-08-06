const { Note, Tag, Category, NoteTag } = require('../models/models');
const { Op } = require('sequelize');

// PUBLIC_INTERFACE
/**
 * Creates a note for the user with optional tags and category.
 */
async function createNote(userId, title, content, categoryId = null, tagNames = []) {
  const note = await Note.create({ userId, title, content, categoryId });
  if (tagNames.length) {
    await setNoteTags(note, tagNames);
  }
  return getNoteById(userId, note.id);
}

// PUBLIC_INTERFACE
/**
 * Retrieves all notes for a user, optionally filtered by category, tag, or search query.
 */
async function getNotes(userId, { search, categoryId, tag } = {}) {
  const where = { userId };
  if (categoryId) where.categoryId = categoryId;
  let include = [
    { model: Tag, through: { attributes: [] } },
    { model: Category }
  ];

  // Basic search
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { content: { [Op.like]: `%${search}%` } },
    ];
  }

  if (tag) {
    include = [
      ...include,
      {
        model: Tag,
        where: { name: tag },
        through: { attributes: [] }
      }
    ];
  }

  return await Note.findAll({ where, include, order: [['updatedAt', 'DESC']] });
}

// PUBLIC_INTERFACE
/**
 * Get a single note by ID, belonging to this user.
 */
async function getNoteById(userId, noteId) {
  return await Note.findOne({
    where: { userId, id: noteId },
    include: [{ model: Tag, through: { attributes: [] } }, { model: Category }]
  });
}

// PUBLIC_INTERFACE
/**
 * Updates a note (title/content/category/tags) by id.
 */
async function updateNote(userId, noteId, { title, content, categoryId, tagNames }) {
  const note = await Note.findOne({ where: { userId, id: noteId } });
  if (!note) throw new Error('Note not found');
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (categoryId !== undefined) note.categoryId = categoryId;
  await note.save();
  if (tagNames !== undefined) {
    await setNoteTags(note, tagNames);
  }
  return await getNoteById(userId, noteId);
}

// PUBLIC_INTERFACE
/**
 * Deletes a note.
 */
async function deleteNote(userId, noteId) {
  const numDeleted = await Note.destroy({ where: { userId, id: noteId } });
  return numDeleted > 0;
}

// PUBLIC_INTERFACE
/**
 * Helper: Set tags for a note (create tags if not exists)
 */
async function setNoteTags(note, tagNames) {
  // Tag entity upsert
  const tags = [];
  for (const name of tagNames) {
    const [tag] = await Tag.findOrCreate({ where: { name } });
    tags.push(tag);
  }
  await note.setTags(tags);
}

/**
 * Add a tag to a note.
 */
async function addTagToNote(userId, noteId, tagName) {
  const note = await Note.findOne({ where: { userId, id: noteId } });
  if (!note) throw new Error('Note not found');
  const [tag] = await Tag.findOrCreate({ where: { name: tagName } });
  await note.addTag(tag);
}

/**
 * Remove a tag from a note.
 */
async function removeTagFromNote(userId, noteId, tagName) {
  const note = await Note.findOne({ where: { userId, id: noteId } });
  if (!note) throw new Error('Note not found');
  const tag = await Tag.findOne({ where: { name: tagName } });
  if (tag) await note.removeTag(tag);
}

/**
 * Get tags for current user.
 */
async function getUserTags(userId) {
  // Only tags on this user's notes
  const tags = await Tag.findAll({
    include: {
      model: Note,
      where: { userId }
    }
  });
  return tags;
}

/**
 * Get all note categories for a user.
 */
async function getCategories(userId) {
  return await Category.findAll({ where: { userId } });
}

/**
 * Create a new category for a user.
 */
async function createCategory(userId, name) {
  return await Category.create({ userId, name });
}

/**
 * Update a user's category.
 */
async function updateCategory(userId, categoryId, name) {
  const category = await Category.findOne({ where: { userId, id: categoryId } });
  if (!category) throw new Error('Category not found');
  category.name = name;
  await category.save();
  return category;
}

/**
 * Delete a user's category.
 */
async function deleteCategory(userId, categoryId) {
  const deleted = await Category.destroy({ where: { userId, id: categoryId } });
  return deleted > 0;
}

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  addTagToNote,
  removeTagFromNote,
  getUserTags,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

