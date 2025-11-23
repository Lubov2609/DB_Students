const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // обязательно для удалённого сервера
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: process.env.DATABASE_URL.includes("render.com") ? { rejectUnauthorized: false } : false
// });

// module.exports = {
//     query: (text, params) => pool.query(text, params),
//     pool
// };