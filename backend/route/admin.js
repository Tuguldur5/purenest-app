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
router.get('/api/admin/pricing', isAdminMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT *
            FROM pricing_settings
            ORDER BY id DESC
            LIMIT 1
        `);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Үнийн тохиргоо олдсонгүй" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Pricing Fetch Error:", err);
        res.status(500).json({ error: "Үнийн тохиргоо татаж чадсангүй." });
    }
});

router.put('/api/admin/pricing', isAdminMiddleware, async (req, res) => {
    const pricingData = req.body;

    if (!pricingData.suh || !pricingData.frequency) {
        return res.status(400).json({ error: "SUH эсвэл Frequency мэдээлэл дутуу байна" });
    }

    try {
        await pool.query(
            `INSERT INTO pricing_settings (
                office_price_per_sqm,
                public_area_price_per_sqm,
                suh_apartment_base,
                suh_floor_price,
                suh_lift_price,
                suh_room_price,
                daily_discount,
                weekly_discount,
                biweekly_discount
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [
                pricingData.office_price_per_sqm,
                pricingData.public_area_price_per_sqm,
                pricingData.suh.apartment,
                pricingData.suh.floor,
                pricingData.suh.lift,
                pricingData.suh.room,
                pricingData.frequency.daily,
                pricingData.frequency.weekly,
                pricingData.frequency.biweekly
            ]
        );

        res.json({ message: "Шинэ үнийн тохиргоо амжилттай хадгалагдлаа." });
    } catch (err) {
        console.error("Pricing Insert Error:", err);
        res.status(500).json({ error: "Үнийн тохиргоо хадгалахад алдаа гарлаа." });
    }
});

module.exports = router;
