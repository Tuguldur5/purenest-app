// server.js
const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');    
require('dotenv').config();
const pool = require('./db.js'); // PostgreSQL холболт

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
 
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

app.get('/', (req, res) => {
    res.send('Purenest Backend Server is running successfully!');
});

app.use('/auth', require('./route/auth'));

app.post('/api/booking', authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.id;
        const userDetails = await fetchUserDetails(user_id);

        const {
            service,
            date,
            address,
            totalPrice,
            roomsCount,
            extrasCount,
            suhInfo,
            frequency,
            city,
            district,
            khoroo,
            public_area_size
        } = req.body;

        const orderResult = await pool.query(
            `INSERT INTO orders
            (user_id, service, date, address, total_price, status,
             rooms_count, extras_count, suh_info, frequency, city, district, khoroo, public_area_size )
             VALUES ($1,$2,$3,$4,$5,'Хүлээгдэж байна',$6,$7,$8,$9,$10,$11,$12,$13)
             RETURNING *`,
            [
                user_id,
                service || 'Тодорхойгүй үйлчилгээ',
                date || new Date().toISOString(),
                address || '',
                totalPrice || 0,
                JSON.stringify(roomsCount || {}),
                JSON.stringify(extrasCount || {}),
                JSON.stringify(suhInfo || {}),
                frequency || 'Нэг удаа',
                city || '',
                district || '',
                khoroo || '',
                public_area_size || 0
            ]
        );

        // ---------------------------
        // EMAIL SEND PART
        // ---------------------------
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER, // example: info@domain.mn
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Booking System" <${process.env.MAIL_USER}>`,
            to: "it@silla-group.mn", // → бүх мэдээлэл энэ майл рүү ирнэ
            subject: "Шинэ захиалга ирлээ",
            html: `
                <h2>Шинэ захиалга</h2>
                <p><strong>Үйлчилгээ:</strong> ${service}</p>
                <p><strong>Огноо:</strong> ${date}</p>
                <p><strong>Хаяг:</strong> ${address}</p>
                <p><strong>Нийт үнэ:</strong> ${totalPrice}₮</p>
                <p><strong>Хот:</strong> ${city}, <strong>Дүүрэг:</strong> ${district}, <strong>Хороо:</strong> ${khoroo}</p>
                <p><strong>Давтамж:</strong> ${frequency}</p>

                <h3>Өрөөний мэдээлэл</h3>
                <pre>${JSON.stringify(roomsCount, null, 2)}</pre>

                <h3>Нэмэлт үйлчилгээ</h3>
                <pre>${JSON.stringify(extrasCount, null, 2)}</pre>

                <h3>СӨХ мэдээлэл</h3>
                <pre>${JSON.stringify(suhInfo, null, 2)}</pre>

                <h3>Олон нийтийн талбайн хэмжээ:</h3>
                <p>${public_area_size} м²</p>

                <hr/>
                <p>Захиалагчийн мэдээлэл:</p>
                <pre>${JSON.stringify(userDetails, null, 2)}</pre>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Захиалга үүслээ, имэйл илгээгдлээ!',
            order: orderResult.rows[0],
        });

    } catch (err) {
        console.error("Захиалга илгээхэд алдаа:", err);
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
const adminRoutes = require("./route/admin");
app.use("/api/admin", adminRoutes);

app.get("/api/admin/users", isAdminMiddleware, async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT * FROM orders WHERE user_id = $1`,
    );
        res.json({ users: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// All orders
app.get('/api/admin/orders', isAdminMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM orders WHERE user_id = $1`,
        );
        res.json({ orders: result.rows });
    } catch (err) {
        console.error("Admin Orders Fetch Error:", err);
        res.status(500).json({ error: "Серверийн алдаа." });
    }
});
// Update order status
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
// PUT /api/admin/pricing
app.get('/api/admin/pricing', isAdminMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pricing_settings WHERE id = 1');
        if (result.rows.length === 0) return res.status(404).json({ error: "Үнэний тохиргоо олдсонгүй" });

        const row = result.rows[0];
        res.json({
            office_price_per_sqm: row.office_price_per_sqm,
            public_area_price_per_sqm: row.public_area_price_per_sqm,
            suh_apartment_base: row.suh_apartment_base,
            suh_floor_price: row.suh_floor_price,
            suh_lift_price: row.suh_lift_price,
            suh_room_price: row.suh_room_price,
            daily_discount: row.daily_discount,
            weekly_discount: row.weekly_discount,
            biweekly_discount: row.biweekly_discount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Үнийн тохиргоо авахад алдаа гарлаа" });
    }
});

app.put('/api/admin/pricing', isAdminMiddleware, async (req, res) => {
    const pricingData = req.body;

    if (!pricingData.suh || !pricingData.frequency) {
        return res.status(400).json({ error: "SUH эсвэл Frequency мэдээлэл дутуу байна" });
    }

    try {
        await pool.query(
            `UPDATE pricing_settings 
             SET office_price_per_sqm = $1,
                 public_area_price_per_sqm = $2,
                 suh_apartment_base = $3,
                 suh_floor_price = $4,
                 suh_lift_price = $5,
                 suh_room_price = $6,
                 daily_discount = $7,
                 weekly_discount = $8,
                 biweekly_discount = $9
             WHERE id = 1`,
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
        res.json({ message: "Үнийн тохиргоо амжилттай хадгалагдлаа." });
    } catch (err) {
        console.error("Pricing Update Error:", err);
        res.status(500).json({ error: "Үнийн тохиргоо хадгалахад алдаа гарлаа." });
    }
});


// GET /api/admin/pricing (React хуудсанд fetch хийхэд ашиглана)
// GET /api/admin/pricing
app.get('/api/admin/pricing', isAdminMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM pricing_settings WHERE id = 1`);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Үнийн тохиргоо олдсонгүй" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Pricing Fetch Error:", err);
        res.status(500).json({ error: "Үнийн тохиргоо татаж чадсангүй." });
    }
});



// Серверийг асаах
app.listen(4000, async () => {
    try {
        await pool.query("SELECT NOW()");
        console.log("DB-тэй амжилттай холбогдлоо!");
    } catch (err) {
        console.error("DB холболтын алдаа:", err);
    }
    console.log('Server running on port 4000');
});
