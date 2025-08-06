const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
});

// Note Model
const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  }
}, {
  tableName: 'notes',
  timestamps: true,
});

// Category Model
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false,
  }
}, {
  tableName: 'categories',
  timestamps: true,
});

// Tag Model
const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'tags',
  timestamps: true,
});

// NoteTag join table
const NoteTag = sequelize.define('NoteTag', {
  noteId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
  },
  tagId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
  }
}, {
  tableName: 'note_tags',
  timestamps: false,
});

// Associations
User.hasMany(Note, { foreignKey: 'userId', onDelete: 'CASCADE' });
Note.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Note, { foreignKey: 'categoryId' });
Note.belongsTo(Category, { foreignKey: 'categoryId' });

Note.belongsToMany(Tag, { through: NoteTag, foreignKey: 'noteId', otherKey: 'tagId' });
Tag.belongsToMany(Note, { through: NoteTag, foreignKey: 'tagId', otherKey: 'noteId' });

module.exports = {
  User,
  Note,
  Category,
  Tag,
  NoteTag,
};

