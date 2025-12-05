const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db.js');

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_HIGHLY_SECURE_SECRET_KEY_123';

// Auth middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token олдсонгүй.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(403).json({ error: 'Token хүчингүй.' });
    }
};

// Admin middleware
const isAdminMiddleware = (req, res, next) => {
    authMiddleware(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ error: 'Зөвхөн админ эрхээр хандах боломжтой.' });
        }
    });
};

// Route жишээ
router.get('/orders', isAdminMiddleware, async (req, res) => {
    const result = await pool.query(`
        SELECT o.*, u.full_name, u.phone_number
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
    `);
    res.json({ orders: result.rows });
});

module.exports = router;
    