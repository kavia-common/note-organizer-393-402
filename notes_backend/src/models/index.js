const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_URL,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
    },
  }
);

// PUBLIC_INTERFACE
/**
 * Get the Sequelize instance for database access.
 * @returns {Sequelize} The Sequelize connection instance.
 */
const getSequelize = () => sequelize;

module.exports = { sequelize, getSequelize };

