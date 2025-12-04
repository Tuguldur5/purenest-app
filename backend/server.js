// server.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('./db'); // PostgreSQL холболт

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_HIGHLY_SECURE_SECRET_KEY_123';

// ---------------------------
// Middleware
// ---------------------------
async function fetchUserDetails(user_id) {
    try {
        const userQuery = await pool.query(
            `SELECT full_name, phone_number FROM users WHERE id = $1`,
            [user_id]
        );
        return userQuery.rows[0];
    } catch (error) {
        console.error("Fetch user details error:", error);
        return null;
    }
}

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Нэвтрэлт шаардлагатай. Token олдсонгүй.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token хүчингүй эсвэл хугацаа нь дууссан.' });
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

// ---------------------------
// Routes
// ---------------------------
app.get('/', (req, res) => {
    res.send('Purenest Backend Server is running successfully!');
});

// Auth
app.use('/auth', require('./route/auth'));

// Захиалга хийх
app.post('/api/booking', authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.id || req.user.userId;
        const userDetails = await fetchUserDetails(user_id);
        const { service, date, address, totalPrice } = req.body;

        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, service, date, address, total_price, status)
             VALUES ($1, $2, $3, $4, $5, 'Хүлээгдэж байна') RETURNING *`,
            [user_id, service, date, address, totalPrice]
        );

        res.json({
            success: true,
            message: 'Захиалга амжилттай үүслээ!',
            order: orderResult.rows[0],
            user_info: userDetails
        });
    } catch (err) {
        console.error("Захиалга илгээхэд алдаа гарлаа:", err);
        res.status(500).json({ error: 'Захиалга хийхэд алдаа гарлаа' });
    }
});

// Захиалгын түүх
app.get('/api/orders/history', authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.id || req.user.userId;
        const result = await pool.query(
            `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Захиалгын түүх татахад алдаа гарлаа:", err);
        res.status(500).json({ error: 'Алдаа гарлаа' });
    }
});

// Admin routes
app.use("/api/admin", require("./route/admin"));

// Бүх захиалгыг авах
app.get('/api/admin/orders', isAdminMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.*, u.full_name, u.phone_number
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);
        res.json({ orders: result.rows });
    } catch (err) {
        console.error("Admin Orders Fetch Error:", err);
        res.status(500).json({ error: "Серверийн алдаа." });
    }
});

// Захиалгын төлөв шинэчлэх
app.put('/api/admin/orders/:id/status', isAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['Хүлээгдэж байна', 'Баталгаажсан', 'Дууссан', 'Цуцлагдсан'];

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

// Үнийн тохиргоо хадгалах
app.post('/api/admin/pricing', isAdminMiddleware, async (req, res) => {
    const pricingData = req.body;
    try {
        await pool.query(
            `UPDATE pricing_settings 
             SET office_price_per_sqm = $1, suh_apartment_base = $2, suh_floor_price = $3, daily_discount = $4 
             WHERE id = 1`,
            [
                pricingData.office_price_per_sqm,
                pricingData.suh_apartment_base,
                pricingData.suh_floor_price,
                pricingData.daily_discount
            ]
        );
        res.json({ message: "Үнийн тохиргоо амжилттай хадгалагдлаа." });
    } catch (err) {
        console.error("Pricing Update Error:", err);
        res.status(500).json({ error: "Үнийн тохиргоо хадгалахад алдаа гарлаа." });
    }
});

// Серверийг асаах
app.listen(4000, async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("📌 DB-тэй амжилттай холбогдлоо!");
    } catch (err) {
        console.error("❌ DB холболтын алдаа:", err);
    }
    console.log('Server running on port 4000');
});
