const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // PostgreSQL холболт

const router = express.Router();

// ⚠️ JWT SECRET-ийг орчны хувьсагчаас дуудах
const JWT_SECRET = process.env.JWT_SECRET || 'PLEASE_CHANGE_ME_IN_ENV';

// --- REGISTER ---
router.post("/register", async (req, res) => {
    // 💡 user-ийн default role-ийг 'user' гэж тогтоов
    const { full_name, email, password, phone } = req.body;
    const defaultRole = 'user'; // Энд та default role-ийг тохируулна

    try {
        // Имэйл давхардлыг шалгах
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rowCount > 0) {
            return res.status(409).json({ error: "Энэ имэйл хаяг бүртгэлтэй байна." });
        }

        // Нууц үгийг hash хийх
        const hash = await bcrypt.hash(password, 10);

        // 💡 SQL Query-д role-ийг нэмж оруулав
        await pool.query(
            [full_name, email, hash, phone, defaultRole]
        );

        res.status(201).json({ message: "Бүртгэл амжилттай!" });
    } catch (err) {
        console.error("Бүртгэлийн алдаа:", err);
        res.status(500).json({ error: "Серверийн дотоод алдаа гарлаа." });
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