const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // PostgreSQL холболт

const router = express.Router();
// 💡 router.use(cors()); -ийг хассан. Үүнийг үндсэн server.js дээр хийх ёстой.

// ⚠️ JWT SECRET-ийг орчны хувьсагчаас дуудах (server.js-ийн тусламжтайгаар)
const JWT_SECRET = process.env.JWT_SECRET || 'PLEASE_CHANGE_ME_IN_ENV'; 

// --- REGISTER ---
router.post("/register", async (req, res) => {
    const { full_name, email, password, phone } = req.body;

    try {
        // Имэйл давхардлыг шалгах (Заавал хийх ёстой)
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rowCount > 0) {
            return res.status(409).json({ error: "Энэ имэйл хаяг бүртгэлтэй байна." });
        }
        
        // Нууц үгийг hash хийх
        const hash = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (full_name, email, password_hash, phone) VALUES ($1, $2, $3, $4)",
            [full_name, email, hash, phone]
        );

        res.status(201).json({ message: "Бүртгэл амжилттай!" });
    } catch (err) {
        console.error("Бүртгэлийн алдаа:", err);
        // DB-ийн бусад алдааг 500-аар буцаана
        res.status(500).json({ error: "Серверийн дотоод алдаа гарлаа." });
    }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

        if (userResult.rowCount === 0)
            return res.status(400).json({ error: "Имэйл эсвэл нууц үг буруу!" });

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch)
            return res.status(400).json({ error: "Имэйл эсвэл нууц үг буруу!" });
        
        // Токен үүсгэхдээ JWT_SECRET-ийг ашиглаж байна
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

        res.json({ message: "Амжилттай нэвтэрлээ!", token, user: { id: user.id, email: user.email, full_name: user.full_name } });
    } catch (err) {
        console.error("Нэвтрэх алдаа:", err);
        res.status(500).json({ error: "Серверийн дотоод алдаа гарлаа." });
    }
});

module.exports = router;