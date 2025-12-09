const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db.js');

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_HIGHLY_SECURE_SECRET_KEY_123';

// -------------------- AUTH MIDDLEWARE --------------------
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

const isAdminMiddleware = (req, res, next) => {
    authMiddleware(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ error: 'Зөвхөн админ эрхээр хандах боломжтой.' });
        }
    });
};

// -------------------- ADMIN: USERS ROUTE --------------------
router.get('/users', isAdminMiddleware, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM users`
        );

        res.json({ users: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// -------------------- ADMIN: ORDERS ROUTE --------------------
router.get('/orders', isAdminMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM orders 
        `);

        res.json({ orders: result.rows });
    } catch (err) {
        console.error("Admin Orders Fetch Error:", err);
        res.status(500).json({ error: "Серверийн алдаа." });
    }
});

// -------------------- ADMIN: UPDATE ORDER STATUS --------------------
router.put('/orders/:id/status', isAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
        'Хүлээгдэж байна',
        'Баталгаажсан',
        'Дууссан',
        'Цуцлагдсан'
    ];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Буруу төлөв илгээсэн." });
    }

    try {
        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *',
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Захиалга олдсонгүй." });
        }

        res.json({ message: "Төлөв амжилттай шинэчлэгдлээ", order: result.rows[0] });
    } catch (err) {
        console.error("Order Status Update Error:", err);
        res.status(500).json({ error: "Серверийн алдаа." });
    }
});

module.exports = router;
