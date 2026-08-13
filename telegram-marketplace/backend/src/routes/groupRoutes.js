// backend/src/routes/groupRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../utils/database');

const router = express.Router();

// Create group
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const creator_id = req.userId;

    const groupResult = await pool.query(
      'INSERT INTO groups (name, description, creator_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, creator_id]
    );

    const group = groupResult.rows[0];

    // Add creator as admin
    await pool.query(
      'INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3)',
      [group.id, creator_id, 'admin']
    );

    // Add other members
    if (members && members.length > 0) {
      for (const memberId of members) {
        await pool.query(
          'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
          [group.id, memberId]
        );
      }
    }

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Get user's groups
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const groups = await pool.query(
      `SELECT g.* FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = $1
       ORDER BY g.created_at DESC`,
      [userId]
    );

    res.json(groups.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Get group messages
router.get('/:groupId/messages', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await pool.query(
      'SELECT * FROM group_messages WHERE group_id = $1 ORDER BY created_at ASC',
      [groupId]
    );

    res.json(messages.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
