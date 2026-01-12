const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db.js"); // PostgreSQL холболт

const router = express.Router();

// ⚠️ JWT SECRET-ийг орчны хувьсагчаас дуудах
const JWT_SECRET = process.env.JWT_SECRET || 'PLEASE_CHANGE_ME_IN_ENV';

// backend/routes/auth.js

// ... (бусад import-ууд: express, pool, bcrypt гэх мэт)

router.post("/google", async (req, res) => {
    const { full_name, email } = req.body;
    const defaultRole = 'user';

    try {
        // 1. Энэ и-мэйлээр хэрэглэгч бүртгэлтэй байгаа эсэхийг шалгах
        const userCheck = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        let user;

        if (userCheck.rowCount > 0) {
            // 2. Хэрэв хэрэглэгч аль хэдийн байгаа бол тэр хэрэглэгчийг буцаана
            user = userCheck.rows[0];
        } else {
            // 3. Хэрэв байхгүй бол шинээр бүртгэнэ
            // Google-ээр нэвтэрч байгаа тул password_hash-ийг 'GOOGLE_USER' гэж тэмдэглэж болно
            const newUser = await pool.query(
                `INSERT INTO users (full_name, email, role, password_hash)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [full_name, email, defaultRole, 'GOOGLE_AUTH_EXTERNAL']
            );
            user = newUser.rows[0];
        }

        // 4. Амжилттай бол хэрэглэгчийн мэдээллийг буцаана
        res.status(200).json({ 
            message: "Google-ээр амжилттай нэвтэрлээ", 
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Google login backend error:", err);
        res.status(500).json({ error: "Серверийн алдаа гарлаа." });
    }
});
// --- REGISTER ---
router.post("/register", async (req, res) => {
    const { full_name, email, password, phone } = req.body;
    const defaultRole = 'user';

    try {
        // 1. Email давхардал шалгах
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rowCount > 0) {
            return res.status(409).json({ error: "Энэ имэйл бүртгэлтэй байна." });
        }

        // 2. Password hash хийх
        const hash = await bcrypt.hash(password, 10);

        // 3. ШИНЭ хэрэглэгч оруулах — ЭНД Л АЛДАА БАЙСАН
        await pool.query(
            `INSERT INTO users (full_name, email, password_hash, phone, role)
             VALUES ($1, $2, $3, $4, $5)`,
            [full_name, email, hash, phone, defaultRole]
        );

        res.status(201).json({ message: "Бүртгэл амжилттай!" });
        
    } catch(err) {
        console.error("Бүртгэлийн алдаа:", err);
        res.status(500).json({ error: "Серверийн алдаа." });
    }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // 💡 Хэрэглэгчийн role-ийг мөн SELECT хийж авах
        const userResult = await pool.query("SELECT id, email, full_name, password_hash, role FROM users WHERE email=$1", [email]);

        if (userResult.rowCount === 0)
            return res.status(400).json({ error: "Имэйл эсвэл нууц үг буруу!" });

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch)
            return res.status(400).json({ error: "Имэйл эсвэл нууц үг буруу!" });

        // 💡 1. Токен үүсгэхдээ role-ийг payload-д нэмэв
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role // 💡 ROLE-ийг токен дотор оруулав
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 💡 2. Response-д role-ийг user объект дотор буцаав
        res.json({
            message: "Амжилттай нэвтэрлээ!",
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role // 💡 ROLE-ийг Frontend-д дамжуулав
            }
        });
    } catch (err) {
        console.error("Нэвтрэх алдаа:", err);
        res.status(500).json({ error: "Серверийн дотоод алдаа гарлаа." });
    }
});

module.exports = router;