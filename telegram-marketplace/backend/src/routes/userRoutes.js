// backend/src/routes/userRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../utils/database');

const router = express.Router();

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'SELECT id, username, display_name, avatar_url, bio FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Search users
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const results = await pool.query(
      `SELECT id, username, display_name, avatar_url FROM users 
       WHERE username ILIKE $1 OR display_name ILIKE $1
       LIMIT 20`,
      [`%${query}%`]
    );

    res.json(results.rows);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Add contact
router.post('/contacts/:contactId', authMiddleware, async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.userId;

    const result = await pool.query(
      'INSERT INTO contacts (user_id, contact_user_id) VALUES ($1, $2) RETURNING *',
      [userId, contactId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Contact already exists' });
    }
    res.status(500).json({ error: 'Failed to add contact' });
  }
});

// Get user's contacts
router.get('/contacts', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const contacts = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.avatar_url FROM users u
       JOIN contacts c ON u.id = c.contact_user_id
       WHERE c.user_id = $1
       ORDER BY u.username ASC`,
      [userId]
    );

    res.json(contacts.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Update user profile
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const { display_name, avatar_url, bio } = req.body;
    const userId = req.userId;

    const result = await pool.query(
      `UPDATE users SET display_name = $1, avatar_url = $2, bio = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [display_name, avatar_url, bio, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
