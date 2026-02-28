const db = require('../config/database');

// ===============================
// POST /api/messages
// ===============================
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'receiverId y content son obligatorios' });
    }

    const result = await db.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, sender_id, receiver_id, content, created_at, read`,
      [senderId, receiverId, content]
    );

    return res.status(201).json({ message: result.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error enviando mensaje' });
  }
};

// ===============================
// GET /api/messages
// Lista de conversaciones
// ===============================
exports.getConversations = async (req, res) => {
  try {
    const authUserId = req.user.id;

    const result = await db.query(
      `
      WITH user_conversations AS (
        SELECT
          CASE
            WHEN sender_id = $1 THEN receiver_id
            ELSE sender_id
          END AS other_user_id,
          MAX(created_at) AS last_message_date
        FROM messages
        WHERE sender_id = $1 OR receiver_id = $1
        GROUP BY other_user_id
      )
      SELECT
        uc.other_user_id AS "userId",

        COALESCE(
          NULLIF(mp.artistic_name, ''),
          u.name
        ) AS "userName",

        mp.profile_image AS "userImage",

        m.content AS "lastMessage",
        m.created_at AS "lastMessageDate",

        (
          SELECT COUNT(*)
          FROM messages unread
          WHERE unread.sender_id = uc.other_user_id
            AND unread.receiver_id = $1
            AND unread.read = FALSE
        ) AS unread

      FROM user_conversations uc

      JOIN messages m
        ON (
          (m.sender_id = $1 AND m.receiver_id = uc.other_user_id)
          OR
          (m.sender_id = uc.other_user_id AND m.receiver_id = $1)
        )
        AND m.created_at = uc.last_message_date

      JOIN users u ON u.id = uc.other_user_id
      LEFT JOIN musician_profiles mp
        ON mp.user_id = uc.other_user_id
        AND mp.profile_complete = TRUE

      ORDER BY uc.last_message_date DESC
      `,
      [authUserId]
    );

    return res.status(200).json({ conversations: result.rows });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo conversaciones' });
  }
};

// ===============================
// GET /api/messages/:userId
// ===============================
exports.getConversation = async (req, res) => {
  try {
    const authUserId = req.user.id;
    const otherUserId = req.params.userId;

    const result = await db.query(
      `SELECT id, sender_id, receiver_id, content, created_at, read
       FROM messages
       WHERE 
         (sender_id = $1 AND receiver_id = $2)
         OR
         (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [authUserId, otherUserId]
    );

    await db.query(
      `UPDATE messages
       SET read = TRUE
       WHERE receiver_id = $1
         AND sender_id = $2
         AND read = FALSE`,
      [authUserId, otherUserId]
    );

    return res.status(200).json({ messages: result.rows });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo conversación' });
  }
};