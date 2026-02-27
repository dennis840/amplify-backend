require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const fixTables = async () => {
  try {
    // 1. Eliminar columnas del perfil de la tabla users
    await pool.query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS artistic_name,
      DROP COLUMN IF EXISTS country,
      DROP COLUMN IF EXISTS province,
      DROP COLUMN IF EXISTS city,
      DROP COLUMN IF EXISTS profile_image,
      DROP COLUMN IF EXISTS instruments,
      DROP COLUMN IF EXISTS musical_level,
      DROP COLUMN IF EXISTS sings,
      DROP COLUMN IF EXISTS genres,
      DROP COLUMN IF EXISTS influences,
      DROP COLUMN IF EXISTS bio,
      DROP COLUMN IF EXISTS zone,
      DROP COLUMN IF EXISTS demo_url,
      DROP COLUMN IF EXISTS demo_link,
      DROP COLUMN IF EXISTS profile_complete
    `);
    console.log('✅ Columnas eliminadas de users');

    // 2. Crear tabla musician_profiles
    await pool.query(`
      CREATE TABLE IF NOT EXISTS musician_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        artistic_name VARCHAR(100),
        country VARCHAR(50),
        province VARCHAR(50),
        city VARCHAR(50),
        profile_image VARCHAR(500),
        instruments TEXT[],
        musical_level VARCHAR(20),
        sings BOOLEAN,
        genres TEXT[],
        influences TEXT[],
        bio TEXT,
        zone VARCHAR(100),
        demo_url VARCHAR(500),
        demo_link VARCHAR(500),
        profile_complete BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Tabla musician_profiles creada correctamente');

    pool.end();
  } catch (e) {
    console.error('❌ Error:', e.message);
    pool.end();
  }
};

fixTables();