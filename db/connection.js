const { Pool } = require('pg');
const ENV = process.env.NODE_ENV = 'test' ? 'test': 'development';

require('dotenv').config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE) {
  throw new Error('PGDATABASE not set');
}

const config = ENV === 'production' ? {
  connectionString: process.env.DATABASE_URL,
  max: 2,
} : {};


const securityDetails = {
  user: 'lewis',
  host: 'localhost',
  password: 'password',
  port: 5432
  }


module.exports = new Pool(securityDetails, config);
