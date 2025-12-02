const express = require('express');
const router = express.Router();
// ✅ Middleware-уудыг импортолж авч байна
const { isAdminMiddleware } = require('../middleware/index'); 
const pool = require("../db");

// Захиалгын жагсаалтыг авах (Зөвхөн Админ)
// GET /orders
router.get('/orders', isAdminMiddleware, async (req, res) => {
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

// Захиалгын төлөвийг өөрчлөх (Зөвхөн Админ)
// PUT /orders/:id/status
router.put('/orders/:id/status', isAdminMiddleware, async (req, res) => {
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

// Үнийн тохиргоог хадгалах/шинэчлэх API (Зөвхөн Админ)
// POST /pricing
router.post('/pricing', isAdminMiddleware, async (req, res) => {
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

module.exports = router;