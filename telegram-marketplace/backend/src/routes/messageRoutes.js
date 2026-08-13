// backend/src/routes/messageRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../utils/database');

const router = express.Router();

// Get messages between two users
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const messages = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
       OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [currentUserId, userId]
    );

    res.json(messages.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.userId;

    if (!receiver_id || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *',
      [sender_id, receiver_id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark message as read
router.patch('/:messageId/read', authMiddleware, async (req, res) => {
  try {
    const { messageId } = req.params;

    const result = await pool.query(
      'UPDATE messages SET is_read = true WHERE id = $1 RETURNING *',
      [messageId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

module.exports = router;
