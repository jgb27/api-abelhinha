import dotenv from 'dotenv';
dotenv.config()
import pkg from 'pg';

export const Client = new pkg.Client({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_DATABASE,
  port: 5432
})
