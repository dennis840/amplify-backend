const db = require('../config/database');

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT COUNT(*) as unread FROM notifications WHERE user_id = $1 AND read = FALSE`,
      [userId]
    );
    res.json({ unread: parseInt(result.rows[0].unread) });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo notificaciones' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await db.query(`UPDATE notifications SET read = TRUE WHERE user_id = $1`, [userId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error marcando notificaciones' });
  }
};