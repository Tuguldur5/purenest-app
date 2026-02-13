// routes/reports.js
const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const { verifyToken } = require('../middleware/index.js'); // Middleware-ээ импортлох

// Тайлан илгээх (Зөвхөн нэвтэрсэн хэрэглэгч)
router.post('/', verifyToken, async (req, res) => {
    const { order_id, description, images } = req.body;

    if (!images || images.length < 3) {
        return res.status(400).json({ message: "Багадаа 3 зураг оруулах шаардлагатай." });
    }

    try {
        const newReport = await pool.query(
            "INSERT INTO order_reports (order_id, description, images) VALUES ($1, $2, $3) RETURNING *",
            [order_id, description, images]
        );

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
// 2. Тайлан шинэчлэх (Update)
router.put('/:order_id', verifyToken, async (req, res) => {
    const { order_id } = req.params;
    const { description, images } = req.body;

    // Зургийн тоог дахин шалгах (Заавал 3-аас дээш байх дүрэм хэвээр бол)
    if (images && images.length < 3) {
        return res.status(400).json({ message: "Тайлан багадаа 3 зурагтай байх ёстой." });
    }

    try {
        // Тайланг шинэчлэх SQL query
        const updatedReport = await pool.query(
            `UPDATE order_reports 
             SET description = COALESCE($1, description), 
                 images = COALESCE($2, images),
                 updated_at = NOW()
             WHERE order_id = $3 
             RETURNING *`,
            [description, images, order_id]
        );

        if (updatedReport.rows.length === 0) {
            return res.status(404).json({ message: "Засах тайлан олдсонгүй." });
        }

        res.json({
            message: "Тайлан амжилттай шинэчлэгдлээ",
            report: updatedReport.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Тайланг шинэчлэхэд алдаа гарлаа." });
    }
});

// Тухайн захиалгын тайланг авах
router.get('/:order_id', verifyToken, async (req, res) => {
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

router.delete('/:order_id', verifyToken, async (req, res) => {
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