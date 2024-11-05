const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'budgetease',
  password: 'pg',
  port: 5432,
});

module.exports = pool;
