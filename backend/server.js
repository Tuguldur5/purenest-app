// server.js
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('./db.js'); // PostgreSQL холболт
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_HIGHLY_SECURE_SECRET_KEY_123';


async function fetchUserDetails(user_id) {
    try {
        const userQuery = await pool.query(
            `SELECT full_name, phone FROM users WHERE id = $1`,
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


app.post('/api/booking', authMiddleware, async (req, res) => {
    try {
        const user_id = req.user.id;

        // 1. DB-ээс хэрэглэгчийн full_name-г automataar шүүж авах
        const userResult = await pool.query(
            'SELECT full_name FROM users WHERE id = $1',
            [user_id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
        }

        const userName = userResult.rows[0].full_name;

        // 2. Frontend-ээс ирж буй мэдээллүүд
        const {
            service, date, address, total_price,
            apartments, floors, lifts, rooms,
            frequency, city, district, khoroo, public_area_size, phone_number
        } = req.body;

        // 3. DB INSERT QUERY
        const orderResult = await pool.query(
            `INSERT INTO orders
             (user_id, service, date, address, total_price, status, 
              apartments, floors, lifts, rooms, 
              frequency, city, district, khoroo, public_area_size, phone_number)
             VALUES ($1,$2,$3,$4,$5,'Хүлээгдэж байна',
                     $6,$7,$8,$9, 
                     $10,$11,$12,$13,$14,$15) 
             RETURNING *`,
            [
                user_id, // $1
                service || 'Тодорхойгүй үйлчилгээ', // $2
                date, // $3
                address || '', // $4
                total_price || 0, // $5 
                apartments || 0, // $6
                floors || 0, // $7
                lifts || 0, // $8
                rooms || 0, // $9  
                frequency || 'Нэг удаа', // $10
                city || '', // $11
                district || '', // $12
                khoroo || '', // $13
                public_area_size || 0, // $14
                phone_number || '' // $15
            ]
        );

        // 4. NODEMAILER ХЭСЭГ
        const SENDER_USER = process.env.MAIL_USER;
        const SENDER_PASS = process.env.MAIL_PASS;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: SENDER_USER,
                pass: SENDER_PASS,
            },
        });

        // Имэйлийн HTML агуулгыг үүсгэхэд DB-ээс авсан userName-ийг ашиглана
        const emailHtml = generateBookingHtml(
            req.body,
            { full_name: userName } // Автоматаар авсан нэр
        );

        const mailOptions = {
            from: `"Захиалгын систем" <${SENDER_USER}>`,
            to: process.env.COMPANY_MAIL || "tuguldur8000@gmail.com",
            subject: `ШИНЭ ЗАХИАЛГА: ${service} - ${userName}`,
            html: emailHtml,
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Захиалга амжилттай хийгдлээ.',
            order: orderResult.rows[0],
        });

    } catch (err) {
        console.error("Захиалга алдаа:", err);
        res.status(500).json({ error: 'Серверт алдаа гарлаа.' });
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
        // Бүх захиалгыг хамгийн сүүлийнхээс нь эхэлж авна
        const result = await pool.query(
            'SELECT * FROM orders ORDER BY created_at DESC' 
        );
        res.json({ orders: result.rows });
    } catch (err) {
        console.error("Admin Orders Fetch Error:", err);
        res.status(500).json({ error: "Серверийн алдаа." });
    }
});
app.put('/api/admin/orders/:id/status', isAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['Хүлээгдэж байна', 'Баталгаажсан', 'Дууссан', 'Цуцлагдсан'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Буруу төлөв илгээсэн." });
    }

    try {
        // id-г заавал Integer болгож хөрвүүлнэ ($2-т дамжуулахдаа)
        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *',
            [status, parseInt(id)] 
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Захиалга олдсонгүй." });
        }

        res.json({ message: "Төлөв амжилттай шинэчлэгдлээ", order: result.rows[0] });
    } catch (err) {
        console.error("Order Status Update Error:", err);
        // Алдааны мессежийг дэлгэрэнгүй харахын тулд err.message-г ашиглаж болно
        res.status(500).json({ error: "Серверийн алдаа: " + err.message });
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


// server.js доторх /api/contact хэсэг

app.post('/api/contact', async (req, res) => {
    // ...
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Бүх талбарыг бөглөнө үү." });
    }

    // 💡 SMTP HOST болон MAIL USER-ийг баталгаажуулж байна
    const SENDER_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'; // Default утга өгч байна
    const SENDER_USER = process.env.MAIL_USER;
    const SENDER_PASS = process.env.MAIL_PASS;
    const SENDER_PORT = Number(process.env.SMTP_PORT || 587);

    // Хэрэв нэвтрэх мэдээлэл байхгүй бол 500 алдаа буцаана
    if (!SENDER_USER || !SENDER_PASS) {
        console.error("EMAIL_USER эсвэл EMAIL_PASS хувьсагчид дутуу байна.");
        return res.status(500).json({ error: 'Серверийн тохиргооны алдаа (Имэйл).' });
    }

    const transporter = nodemailer.createTransport({
        host: SENDER_HOST,
        port: SENDER_PORT,
        secure: SENDER_PORT === 465, // Хэрэв 465 бол true, 587 бол false
        auth: {
            user: SENDER_USER,
            pass: SENDER_PASS,
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.COMPANY_MAIL || SENDER_USER,
        subject: `Холбоо барих маягт: ${name}`,
        html: `<p>Нэр: ${name}</p><p>Имэйл: ${email}</p><p>Мессеж: ${message}</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error("Имэйл илгээх үед гарсан бодит алдаа:", err); // 💡 Энэ алдааг бид дахин харахгүй байхыг хүсэж байна.
        return res.status(500).json({ error: 'Серверийн алдаа. Дахин оролдоно уу.' });
    }
});



// 1. OTP Илгээх
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        console.log("Хүсэлт ирлээ:", email); // Консол дээр харах

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0]; // Postgres-д ингэж авна

        if (!user) {
            return res.status(404).json({ message: 'Хэрэглэгч олдсонгүй' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        // Postgres-д INTERVAL-ийг '5 minutes' гэж бичнэ
        await pool.query(
            "UPDATE users SET otp_code = $1, otp_expires = NOW() + INTERVAL '5 minutes' WHERE email = $2",
            [otp, email]
        );

        // Nodemailer... (EMAIL_USER, EMAIL_PASS байгаа эсэхийг шалгаарай)
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Support" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Нууц үг сэргээх код',
            text: `Таны баталгаажуулах код: ${otp}`
        });

        res.json({ success: true, message: 'OTP илгээгдлээ' });
    } catch (err) {
        console.error("Алдааны дэлгэрэнгүй:", err); // Энэ консол дээрх бичгийг хараарай
        res.status(500).json({ message: 'Серверийн алдаа: ' + err.message });
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
    console.log('Server running on port 4000');
});
