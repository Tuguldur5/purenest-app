// server.js (ЗАСВАРЛАСАН БҮРЭН КОД)

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// 💡 .env файлыг хамгийн эхэнд ачаалах
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ ТОХИРГОО (process.env-ээс дуудах нь зөв)
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_HIGHLY_SECURE_SECRET_KEY_123';

// 💡 DB Pool-ийг ./db.js-ээс импортлох
const pool = require('./db'); 

// ---------------------------
// 💡 ТУСЛАХ ФУНКЦ, MIDDLEWARE
// ---------------------------

// 1. Хэрэглэгчийн мэдээллийг DB-ээс татах (Order-д хэрэгтэй)
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

// 2. JWT Баталгаажуулалтын Middleware (Auth, Booking, History-д хэрэгтэй)
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Нэвтрэлт шаардлагатай. Token олдсонгүй.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id: ..., role: ... }
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token хүчингүй эсвэл хугацаа нь дууссан.' });
    }
};

// 3. ✅ АДМИН ЭРХ ШАЛГАХ MIDDLEWARE (Админ API-уудад хэрэгтэй)
const isAdminMiddleware = (req, res, next) => {
    // Эхлээд JWT-г шалгана
    authMiddleware(req, res, () => {
        // authMiddleware амжилттай бол req.user-т мэдээлэл ирсэн байна
        if (req.user && req.user.role === 'admin') {
            next(); // Админ бол дараагийн функц рүү шилжүүлнэ
        } else {
            // Админ биш бол 403 (Хориглосон) хариу өгнө
            return res.status(403).json({ error: 'Зөвхөн админ эрхээр хандах боломжтой.' });
        }
    });
};

// ---------------------------
// 🚀 API РУУТУУД
// ---------------------------

// 1. Үндсэн route
app.get('/', (req, res) => {
    res.send('Purenest Backend Server is running successfully!');
});

// 2. Auth route-ийг импортлох
const authRoutes = require('./route/auth');

// 3. /auth үндсэн хаягаар холбох (REGISTER, LOGIN)
app.use('/auth', authRoutes);

// 4. Захиалга хийх - /api/booking (authMiddleware-ээр хамгаалсан)
app.post('/api/booking', authMiddleware, async (req, res) => {
    // ... (Захиалга хийх логик, таны код хэвээр) ...
    try {
        const user_id = req.user.id || req.user.userId; 
        const userDetails = await fetchUserDetails(user_id);
        const { service_type, service_date, service_address, total_price } = req.body; // total_price-г нэмэв
        
        // 💡 Захиалгыг DB-д хадгалах
        const orderResult = await pool.query(
            `INSERT INTO orders (user_id, service_type, service_date, service_address, total_price, status) 
             VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
            [user_id, service_type, service_date, service_address, total_price]
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

// 5. Захиалгын түүх авах (ХАМГААЛСАН)
app.get('/api/orders/history', authMiddleware, async (req, res) => {
    // ... (Захиалгын түүх авах логик, таны код хэвээр) ...
    try {
        const user_id = req.user.id || req.user.userId;
        const result = await pool.query(
            `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
            [user_id]);
        res.json(result.rows);
    } catch (err) {
        console.error("Захиалгын түүх татахад алдаа гарлаа:", err);
        res.status(500).json({ error: 'Алдаа гарлаа' });
    }
});

// ✅ 3. АДМИН ROUTE-ийг импортлож холбох
const adminRoutes = require('./route/admin');
app.use('/api/admin', adminRoutes);

// 6. Бүх захиалгыг авах (GET /api/admin/orders)
app.get('/api/admin/orders', isAdminMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                o.*, 
                u.full_name, 
                u.phone_number 
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

// 7. Захиалгын төлөвийг өөрчлөх (PUT /api/admin/orders/:id/status)
app.put('/api/admin/orders/:id/status', isAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Canceled'];

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

// 8. Үнийн тохиргоог хадгалах (POST /api/admin/pricing)
app.post('/api/admin/pricing', isAdminMiddleware, async (req, res) => {
    const pricingData = req.body;
    
    // Энэ бол жишээ. Та pricing_settings хүснэгтээ зөв удирдах логикийг хийнэ.
    try {
        // Жишээ нь: pricing_settings table-ийн 1-р мөрийг update хийх
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
const server = app.listen(4000, async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("📌 DB-тэй амжилттай холбогдлоо!");
    } catch (err) {
        console.error("❌ DB холболтын алдаа:", err);
    }

    console.log('Server running on port 4000');
});