// routes/reports.js
const express = require('express');
const router = express.Router();
const pool = require('../db.js'); // Таны өгөгдлийн сангийн холболт

router.post('/api/reports', async (req, res) => {
    const { order_id, description, images } = req.body;

    // 1. Зургийн тоог шалгах
    if (!images || images.length < 3) {
        return res.status(400).json({ message: "Багадаа 3 зураг оруулах шаардлагатай." });
    }

    try {
        // 2. Тайланг хадгалах
        const newReport = await pool.query(
            "INSERT INTO order_reports (order_id, description, images) VALUES ($1, $2, $3) RETURNING *",
            [order_id, description, images]
        );

        // 3. Захиалгын төлөвийг шинэчлэх
        await pool.query(
            "UPDATE orders SET status = 'Дууссан' WHERE id = $1",
            [order_id]
        );

        res.status(201).json(newReport.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Серверийн алдаа");
    }
});
// 1. Тухайн захиалгын тайланг авах
router.get('/api/reports/:order_id', async (req, res) => {
    try {
        const report = await pool.query("SELECT * FROM order_reports WHERE order_id = $1", [req.params.order_id]);
        if (report.rows.length > 0) {
            res.json(report.rows[0]);
        } else {
            res.status(404).json({ message: "Тайлан олдсонгүй" });
        }
    } catch (err) {
        res.status(500).send("Серверийн алдаа");
    }
});

// 2. Тайлан шинэчлэх (Update)
router.put('/api/reports/:order_id', async (req, res) => {
    const { description, images } = req.body;
    try {
        const updatedReport = await pool.query(
            "UPDATE order_reports SET description = $1, images = $2 WHERE order_id = $3 RETURNING *",
            [description, images, req.params.order_id]
        );
        res.json(updatedReport.rows[0]);
    } catch (err) {
        res.status(500).send("Засахад алдаа гарлаа");
    }
});
router.delete('/:order_id', async (req, res) => {
    const { order_id } = req.params;
    try {
        await pool.query("DELETE FROM order_reports WHERE order_id = $1", [order_id]);
        // Тайлан устгасан бол захиалгын төлөвийг буцаагаад 'Хүлээгдэж байна' болгож болох юм
        await pool.query("UPDATE orders SET status = 'Хүлээгдэж байна' WHERE id = $1", [order_id]);
        res.json({ message: "Тайлан амжилттай устлаа" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;