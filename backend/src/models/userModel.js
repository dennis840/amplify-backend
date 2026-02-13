const db = require('../config/database');

const userModel = {
  // Crear nuevo usuario
  async create(name, email, passwordHash) {
    const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `;
    const result = await db.query(query, [name, email, passwordHash]);
    return result.rows[0];
  },

  // Buscar usuario por email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  },

  // Buscar usuario por ID
  async findById(id) {
    const query = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = userModel;