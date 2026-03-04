// server.js
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('./db.js'); // PostgreSQL холболт
const express = require('express');
const bcrypt = require('bcrypt');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: [
        "https://purenest.mn",
        "https://www.purenest.mn",
        "https://purenest-app.vercel.app", // Өөрийн Vercel хаягийг энд нэмээрэй
        "http://localhost:3000" // Локал дээр туршихад хэрэгтэй
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_HIGHLY_SECURE_SECRET_KEY_123';

async function UserDetails(user_id) {
    try {
        const userQuery = await pool.query(
            `SELECT full_name, email, phone FROM users WHERE id = $1`,
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
    if (!authHeader || !authHeader.startsWith('Bearer')) {
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

const productOrderRoutes = require('./route/productsOrders');
const wishlistRoutes = require('./route/wishlist');
const reportRoutes = require('./route/report');
const cartRoutes = require('./route/cart');
app.use('/api/cart', cartRoutes);
app.use('/api/product-orders', productOrderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/report', reportRoutes);

const generateBookingHtml = (data, userDetails) => {

    const isSuh = data.service === 'СӨХ цэвэрлэгээ';

    let suhDetails = '';
    if (isSuh) {
        suhDetails = `
            <tr><th colspan="2" style="background-color: #f4f4f4; text-align: center;">СӨХ-ийн Барилгын Мэдээлэл</th></tr>
            <tr><th>Байрны тоо</th><td>${data.apartments || 0}</td></tr>
            <tr><th>Давхарын тоо</th><td>${data.floors || 0}</td></tr>
            <tr><th>Лифтийн тоо</th><td>${data.lifts || 0}</td></tr>
            <tr><th>Айлын тоо</th><td>${data.rooms || 0}</td></tr>
        `;
    }

    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
                h2 { color: #102B5A; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
                th { background-color: #f4f4f4; width: 40%; }
                .total { background-color: #e6f7ff; font-weight: bold; font-size: 1.2em; }
                pre { white-space: pre-wrap; font-family: monospace; padding: 10px; background-color: #f9f9f9; border: 1px solid #eee; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>🔔 Шинэ Захиалга: ${data.service}</h2>
                
                <h3>Хэрэглэгчийн Мэдээлэл</h3>
                <table>
                    <tr><th>Нэр</th><td>${userDetails.full_name}</td></tr> 
                    <tr><th>Утас</th><td>${data.phone_number}</td></tr>
                </table>

                <h3>Захиалгын Дэлгэрэнгүй</h3>
                <table>
                    <tr><th>Үйлчилгээ</th><td>${data.service}</td></tr>
                    <tr><th>Давтамж</th><td>${data.frequency}</td></tr>
                    <tr><th>Огноо</th><td>${data.date.substring(0, 10)}</td></tr>
                    <tr><th>Хаяг</th><td>${data.city}, ${data.district}, ${data.khoroo}, ${data.address}</td></tr>
                    
                    ${suhDetails} 
                    
                    <tr><th colspan="2" style="background-color: #ddd;">Бусад Мэдээлэл</th></tr>
                    <tr><th>Талбайн хэмжээ (м²)</th><td>${data.public_area_size || 0} м²</td></tr>

                    <tr class="total">
                        <th>НИЙТ ҮНЭ</th>
                        <td>${Number(data.total_price || 0).toLocaleString()} ₮</td> 
                    </tr>
                </table>

            </div>
        </body>
        </html>
    `;
    return htmlContent;
};

// =========================================================================
app.get('/api/pricing', async (req, res) => {
    const pricing = await PricingSettings.findOne({ order: [['id', 'DESC']] });
    res.json(pricing);
});

// (Энэхүү хэсгийг server.js доторх бусад холбогдох хувьсагч, модулиудын хамт байрлуулна)
app.get('/api/booking/user-info', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT full_name, phone FROM users WHERE id = $1`,
            [userId]
        );

        res.json(result.rows[0] || { full_name: "", phone: "" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "User info fetch failed" });
    }
});
// server.js дээр ингэж засна:
app.get('/api/users/profile', authMiddleware, async (req, res) => {
    try {
        // req.user дотор таны JWT-ээс ирсэн id байгаа
        const user = await UserDetails(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Серверийн алдаа" });
    }
});
app.put('/api/users/update', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { full_name, phone, email } = req.body;

        // 1. Оруулах өгөгдөл бүрэн байгаа эсэхийг шалгах (Validation)
        if (!full_name || !phone || !email) {
            return res.status(400).json({ error: "Бүх талбарыг бөглөнө үү." });
        }

        // 2. И-мэйл эсвэл Утасны дугаар өөр хэрэглэгч дээр байгаа эсэхийг НЭГ хүсэлтээр шалгах
        const duplicateCheck = await pool.query(
            'SELECT email, phone FROM users WHERE (email = $1 OR phone = $2) AND id != $3',
            [email, phone, userId]
        );

        if (duplicateCheck.rows.length > 0) {
            const foundUser = duplicateCheck.rows[0];
            if (foundUser.email === email) {
                return res.status(400).json({ error: "Энэ и-мэйл хаяг аль хэдийн бүртгэгдсэн байна." });
            }
            if (foundUser.phone === phone) {
                return res.status(400).json({ error: "Энэ утасны дугаар аль хэдийн бүртгэгдсэн байна." });
            }
        }

        const result = await pool.query(
            `UPDATE users 
                SET full_name = $1, phone = $2, email = $3 
                WHERE id = $4 
                RETURNING id, full_name, email, phone`,
            [full_name, phone, email, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Хэрэглэгч олдсонгүй." });
        }

        // Амжилттай бол шинэчлэгдсэн датаг буцаах
        res.json(result.rows[0]);

    } catch (err) {
        // Сервер дээр алдааг дэлгэрэнгүй харах
        console.error("UPDATE USER ERROR:", err.message);
        res.status(500).json({ error: "Серверийн алдаа гарлаа: " + err.message });
    }
});

app.post('/api/booking', authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.id;

        // 1. Хэрэглэгчийн нэрийг сангаас татах
        const userResult = await pool.query('SELECT full_name FROM users WHERE id = $1', [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
        }

        const userName = userResult.rows[0].full_name;

        // 2. Request body-оос мэдээллүүдээ задлах (Default утга оноох замаар undefined-аас сэргийлнэ)
        const {
            service = 'Тодорхойгүй үйлчилгээ',
            date,
            address = '',
            total_price = 0,
            apartments = 0,
            floors = 0,
            lifts = 0,
            rooms = 0,
            frequency = 'Нэг удаа',
            city = '',
            district = '',
            khoroo = '',
            public_area_size = 0,
            phone_number = ''
        } = req.body;

        // 3. Database-д захиалгыг хадгалах
        const orderResult = await pool.query(
            `INSERT INTO orders
             (user_id, service, date, address, total_price, status, 
              apartments, floors, lifts, rooms, 
              frequency, city, district, khoroo, public_area_size, phone_number)
             VALUES ($1, $2, $3, $4, $5, 'Хүлээгдэж байна', 
                     $6, $7, $8, $9, 
                     $10, $11, $12, $13, $14, $15) 
             RETURNING *`,
            [
                user_id,           // $1
                service,           // $2
                date,              // $3
                address,           // $4
                total_price,       // $5 
                apartments,        // $6
                floors,            // $7
                lifts,             // $8
                rooms,             // $9  
                frequency,         // $10
                city,              // $11
                district,          // $12
                khoroo,            // $13
                public_area_size,  // $14
                phone_number       // $15
            ]
        );

        try {
            // generateBookingHtml дотор substring(0, 10) байгаа тул date байгаа эсэхийг шалгана
            const safeBody = { ...req.body, date: date || new Date().toISOString() };
            const emailHtml = generateBookingHtml(safeBody, { full_name: userName });

            await resend.emails.send({
                from: 'Booking <onboarding@resend.dev>',
                to: process.env.COMPANY_MAIL || "tuguldur8000@gmail.com",
                subject: `🔔 ШИНЭ ЗАХИАЛГА: ${service} - ${userName}`,
                html: emailHtml,
            });
            console.log("Email sent successfully");
        } catch (mailError) {
            console.error("Resend Email Error:", mailError);
            // Имэйл илгээхэд алдаа гарсан ч захиалга DB-д орсон тул хэрэглэгчид алдаа заахгүй байж болно
        }

        // 5. Амжилттай хариу өгөх
        res.json({
            success: true,
            message: 'Захиалга амжилттай хийгдлээ.',
            order: orderResult.rows[0],
        });

    } catch (err) {
        console.error("Critical Booking Error:", err);
        res.status(500).json({
            error: 'Серверт алдаа гарлаа.',
            details: err.message
        });
    }
});

app.delete('/api/booking/:id', authMiddleware, async (req, res) => {
    try {
        const orderId = parseInt(req.params.id); // ID-г тоо болгож хөрвүүлэх
        const userId = req.user.id;

        // Query-г туршиж үзэх: Баганын нэрсээ DB-тэйгээ тулгаарай
        const query = 'DELETE FROM orders WHERE id = $1 AND user_id = $2 RETURNING *';
        const result = await pool.query(query, [orderId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Захиалга олдсонгүй эсвэл таных биш байна." });
        }

        res.json({ message: "Амжилттай устлаа" });
    } catch (err) {
        console.error("SERVER LOG:", err); // Энэ Render Logs дээр алдааг харуулна
        res.status(500).json({ error: "Серверийн алдаа: " + err.message });
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

app.get('/api/admin/pricing', isAdminMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pricing_settings WHERE id = 1');
        if (result.rows.length === 0) return res.status(404).json({ error: "Үнэний тохиргоо олдсонгүй" });

        const row = result.rows[0];
        res.json({
            office_price_per_sqm: row.office_price_per_sqm,
            public_area_price_per_sqm: row.public_area_price_per_sqm,
            warehouse_price_per_sqm: row.warehouse_price_per_sqm,
            duct_price_per_sqm: row.duct_price_per_sqm,
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
// Үнийн тохиргоог хэн ч уншиж болохоор нээлттэй GET API

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
         biweekly_discount = $9,
         duct_price_per_sqm = $10,
         warehouse_price_per_sqm = $11
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
                pricingData.frequency.biweekly,
                pricingData.duct_price_per_sqm,      // $10
                pricingData.warehouse_price_per_sqm   // $11
            ]
        );
        res.json({ message: "Үнийн тохиргоо амжилттай хадгалагдлаа." });
    } catch (err) {
        console.error("Pricing Update Error:", err);
        res.status(500).json({ error: "Үнийн тохиргоо хадгалахад алдаа гарлаа." });
    }
});
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/products', async (req, res) => {
    const { code, name, price, unit, type, image_url } = req.body;

    try {
        // 1. Код давхцаж байгааг шалгах
        const existingProduct = await pool.query('SELECT * FROM products WHERE code = $1', [code]);

        if (existingProduct.rows.length > 0) {
            // 409 Conflict алдаа буцаана
            return res.status(409).json({ error: "Барааны код давхцаж байна! Өөр код ашиглана уу." });
        }

        // 2. Хэрэв давхцаагүй бол хадгална
        const newProduct = await pool.query(
            'INSERT INTO products (code, name, price, unit, type, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [code, name, price, unit, type, image_url]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Серверийн алдаа" });
    }
});
// server.js
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Таны датабаазын хүснэгтийн нэр 'products' мөн эсэхийг шалгана уу
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});
// --- DELETE: Бараа устгах ---
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.status(200).json({ message: 'Бараа амжилттай устлаа' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Барааны мэдээлэл шинэчлэх (Update)
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { code, name, image_url, unit, price, type } = req.body;

        // Өгөгдлийн сан руу UPDATE хийх
        const result = await pool.query(
            'UPDATE products SET code = $1, name = $2, image_url = $3, unit = $4, price = $5, type = $6 WHERE id = $7 RETURNING *',
            [code, name, image_url, unit, price, type, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Бараа олдсонгүй" });
        }

        res.json(result.rows[0]); // АМЖИЛТТАЙ бол JSON буцаана
    } catch (err) {
        console.error("SERVER ERROR:", err); // Энэ лог Render-ийн Dashboard дээр харагдана
        res.status(500).json({ error: "Сервер дээр алдаа гарлаа: " + err.message });
    }
});

// Энэ бол нээлттэй API. Booking.tsx эндээс үнийг уншина.
app.get('/api/pricing-settings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pricing_settings WHERE id = 1');
        if (result.rows.length === 0) return res.status(404).json({ error: "Үнийн тохиргоо олдсонгүй" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Үнэ авахад алдаа гарлаа" });
    }
});

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Бүх талбарыг бөглөнө үү." });
    }

    try {
        await resend.emails.send({
            from: 'Purenest Contact <onboarding@resend.dev>',
            to: process.env.COMPANY_MAIL || 'sales@purenest.mn',
            subject: `Холбоо барих маягт: ${name}`,
            html: `<p>Нэр: ${name}</p><p>Имэйл: ${email}</p><p>Мессеж: ${message}</p>`,
        });
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error("Resend Error (Contact):", err);
        return res.status(500).json({ error: 'Серверийн алдаа. Дахин оролдоно уу.' });
    }
});

// 1. OTP Илгээх
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ message: 'Хэрэглэгч олдсонгүй' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        await pool.query(
            "UPDATE users SET otp_code = $1, otp_expires = NOW() + INTERVAL '5 minutes' WHERE email = $2",
            [otp, email]
        );

        // Resend ашиглан OTP илгээх
        await resend.emails.send({
            from: 'Security <onboarding@resend.dev>',
            to: email,
            subject: 'Нууц үг сэргээх код',
            text: `Таны баталгаажуулах код: ${otp}`, // Текст хэлбэрээр
            html: `<strong>Таны баталгаажуулах код: ${otp}</strong>`, // HTML хэлбэрээр
        });

        res.json({ success: true, message: 'OTP илгээгдлээ' });
    } catch (err) {
        console.error("Resend Error (Forgot Password):", err);
        res.status(500).json({ message: 'Серверийн алдаа' });
    }
});

// 2. OTP Баталгаажуулах
app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    try {
        // 1. Зөвхөн и-мэйлээр нь хайж үзэх (Цаг болон кодыг шалгахгүйгээр)
        const checkDB = await pool.query('SELECT otp_code, otp_expires, NOW() as current_time FROM users WHERE email = $1', [email]);

        if (checkDB.rows.length === 0) {
            return res.status(400).json({ message: 'Хэрэглэгч олдсонгүй' });
        }

        const dbData = checkDB.rows[0];
        console.log("--- OTP Шалгалт ---");
        console.log("Ирсэн код:", otp, "(Төрөл:", typeof otp, ")");
        console.log("DB-д байгаа код:", dbData.otp_code, "(Төрөл:", typeof dbData.otp_code, ")");
        console.log("DB цаг:", dbData.current_time);
        console.log("Дуусах цаг:", dbData.otp_expires);

        // 2. Код болон хугацааг харьцуулах (trim() ашиглаж илүү зайг устгах)
        if (String(dbData.otp_code).trim() !== String(otp).trim()) {
            return res.status(400).json({ message: 'Код буруу байна' });
        }

        // 3. Цаг шалгах
        const now = new Date();
        const expires = new Date(dbData.otp_expires);
        if (expires < now) {
            return res.status(400).json({ message: 'Кодны хугацаа дууссан байна' });
        }

        // Бүх зүйл зөв бол:
        res.json({ success: true });

    } catch (err) {
        console.error("Verify Error:", err);
        res.status(500).json({ message: 'Серверийн алдаа' });
    }
});

// 3. Нууц үг шинэчлэх
app.post('/api/auth/reset-password', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Тэр илүү байсан таслалыг авч хаяв
        // 2. otp_code-г NULL болгож цэвэрлэх (Дараа нь дахиж ашиглах боломжгүй болгох)
        const query = `
            UPDATE users 
            SET password_hash = $1, otp_code = NULL, otp_expires = NULL
            WHERE email = $2
        `;

        const result = await pool.query(query, [hashedPassword, email]);

        if (result.rowCount > 0) {
            res.json({ success: true, message: 'Нууц үг амжилттай шинэчлэгдлээ' });
        } else {
            res.status(404).json({ message: 'Хэрэглэгч олдсонгүй' });
        }
    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ message: 'Серверийн алдаа' });
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
    console.log('Server on');
});
