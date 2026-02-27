require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const createTables = async () => {
  try {
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS artistic_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS country VARCHAR(50),
      ADD COLUMN IF NOT EXISTS province VARCHAR(50),
      ADD COLUMN IF NOT EXISTS city VARCHAR(50),
      ADD COLUMN IF NOT EXISTS profile_image VARCHAR(500),
      ADD COLUMN IF NOT EXISTS instruments TEXT[],
      ADD COLUMN IF NOT EXISTS musical_level VARCHAR(20),
      ADD COLUMN IF NOT EXISTS sings BOOLEAN,
      ADD COLUMN IF NOT EXISTS genres TEXT[],
      ADD COLUMN IF NOT EXISTS influences TEXT[],
      ADD COLUMN IF NOT EXISTS bio TEXT,
      ADD COLUMN IF NOT EXISTS zone VARCHAR(100),
      ADD COLUMN IF NOT EXISTS demo_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS demo_link VARCHAR(500),
      ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT FALSE
    `);
    console.log('✅ Columnas agregadas correctamente');
    pool.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
    pool.end();
  }
};

createTables();