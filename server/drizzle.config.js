// drizzle.config.js
const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
  schema: './schema/*.js',      
  out:    './drizzle/migrations',
  dialect: 'mysql',     
  dbCredentials: {
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
});
