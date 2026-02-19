const db = require('../config/database');

const passwordResetModel = {
  // Crear token de reset
  async createResetToken(userId, token, expiresAt) {
    const query = `
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, token, expires_at
    `;
    const result = await db.query(query, [userId, token, expiresAt]);
    return result.rows[0];
  },

  // Buscar token válido
  async findValidToken(token) {
    const query = `
      SELECT pr.*, u.email, u.name
      FROM password_resets pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.token = $1 
        AND pr.used = FALSE 
        AND pr.expires_at > NOW()
    `;
    const result = await db.query(query, [token]);
    return result.rows[0];
  },

  // Marcar token como usado
  async markTokenAsUsed(token) {
    const query = `
      UPDATE password_resets 
      SET used = TRUE 
      WHERE token = $1
      RETURNING id
    `;
    const result = await db.query(query, [token]);
    return result.rows[0];
  },

  // Eliminar tokens expirados (limpieza)
  async deleteExpiredTokens() {
    const query = `
      DELETE FROM password_resets 
      WHERE expires_at < NOW() OR used = TRUE
    `;
    await db.query(query);
  }
};

module.exports = passwordResetModel;