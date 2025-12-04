const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");

// ENV тохиргоо
const JWT_SECRET = process.env.JWT_SECRET || "YOUR_HIGHLY_SECURE_SECRET_KEY_123";

// Admin шалгах middleware
function isAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token байхгүй байна." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "Админ эрх шаардлагатай." });
        }

        req.user = decoded;
        next();
    } catch (e) {
        return res.status(403).json({ error: "Token хүчингүй." });
    }
}

// -------------------------
// 🔥 1. Бүх захиалга авах
// -------------------------
router.get("/orders", isAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.*, u.full_name, u.phone_number
            FROM orders o
            LEFT JOIN users u ON u.id = o.user_id
            ORDER BY o.created_at DESC
        `);

        res.json({ orders: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Серверийн алдаа." });
    }
});

// -------------------------
// 🔥 2. Захиалгын төлөв өөрчлөх
// -------------------------
router.put("/orders/:id/status", isAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const valid = ["Pending", "Confirmed", "Completed", "Canceled"];
    if (!valid.includes(status)) {
        return res.status(400).json({ error: "Буруу статус." });
    }

    try {
        const result = await pool.query(
            "UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *",
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Захиалга олдсонгүй." });
        }

        res.json({ message: "Амжилттай шинэчлэгдлээ!", order: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Серверийн алдаа." });
    }
});

// -------------------------
// 🔥 3. Үнийн тохиргоо шинэчлэх
// -------------------------
router.post("/pricing", isAdmin, async (req, res) => {
    const p = req.body;

    try {
        await pool.query(
            `UPDATE pricing_settings SET 
                office_price_per_sqm = $1,
                suh_apartment_base = $2,
                suh_floor_price = $3,
                daily_discount = $4
             WHERE id = 1`,
            [
                p.office_price_per_sqm,
                p.suh_apartment_base,
                p.suh_floor_price,
                p.daily_discount
            ]
        );

        res.json({ message: "Үнийн тохиргоо шинэчлэгдлээ." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Серверийн алдаа." });
    }
});

module.exports = router;
