// backend/src/routes/dealRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const pool = require('../utils/database');

const router = express.Router();

// Create deal
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, type, price, currency, location, images_urls } = req.body;
    const user_id = req.userId;

    if (!title || !description || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO deals (user_id, title, description, category, type, price, currency, location, images_urls) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [user_id, title, description, category, type, price, currency, location, images_urls || []]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// Get all deals with filters
router.get('/', async (req, res) => {
  try {
    const { category, type, search, limit = 20, offset = 0 } = req.query;

    let query = 'SELECT d.*, u.username, u.display_name, u.avatar_url FROM deals d JOIN users u ON d.user_id = u.id WHERE d.status = $1';
    const params = ['active'];

    if (category) {
      query += ` AND d.category = $${params.length + 1}`;
      params.push(category);
    }

    if (type) {
      query += ` AND d.type = $${params.length + 1}`;
      params.push(type);
    }

    if (search) {
      query += ` AND (d.title ILIKE $${params.length + 1} OR d.description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
      params.push(`%${search}%`);
    }

    query += ` ORDER BY d.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit);
    params.push(offset);

    const result = await pool.query(query, params);

    res.json({
      deals: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get deal details
router.get('/:dealId', async (req, res) => {
  try {
    const { dealId } = req.params;

    const result = await pool.query(
      `SELECT d.*, u.id AS seller_id, u.username, u.display_name, u.avatar_url, u.bio 
       FROM deals d 
       JOIN users u ON d.user_id = u.id 
       WHERE d.id = $1`,
      [dealId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

// Update deal status
router.patch('/:dealId', authMiddleware, async (req, res) => {
  try {
    const { dealId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    // Verify ownership
    const dealResult = await pool.query('SELECT user_id FROM deals WHERE id = $1', [dealId]);
    if (dealResult.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await pool.query(
      'UPDATE deals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, dealId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// Send inquiry about a deal
router.post('/:dealId/inquire', authMiddleware, async (req, res) => {
  try {
    const { dealId } = req.params;
    const { message } = req.body;
    const inquirer_id = req.userId;

    const result = await pool.query(
      'INSERT INTO deal_inquiries (deal_id, inquirer_id, message) VALUES ($1, $2, $3) RETURNING *',
      [dealId, inquirer_id, message]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send inquiry' });
  }
});

// Get deal inquiries for seller
router.get('/:dealId/inquiries', authMiddleware, async (req, res) => {
  try {
    const { dealId } = req.params;
    const userId = req.userId;

    // Verify deal ownership
    const dealResult = await pool.query('SELECT user_id FROM deals WHERE id = $1', [dealId]);
    if (dealResult.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const inquiries = await pool.query(
      `SELECT di.*, u.username, u.display_name, u.avatar_url FROM deal_inquiries di
       JOIN users u ON di.inquirer_id = u.id
       WHERE di.deal_id = $1
       ORDER BY di.created_at DESC`,
      [dealId]
    );

    res.json(inquiries.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

module.exports = router;
