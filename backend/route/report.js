const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const { verifyToken } = require('../middleware/index.js');

/**
 * 1. ТАЙЛАН НЭМЭХ (POST)
 * Frontend-ээс { order_id, description, images: ["url1", "url2", "url3"] } ирнэ.
 */
router.post('/', verifyToken, async (req, res) => {
    const { order_id, description, images } = req.body;

    // Шалгалт: Зургийн URL-ууд массив байх ёстой бөгөөд багадаа 3 ширхэг
    if (!Array.isArray(images) || images.length < 3) {
        return res.status(400).json({ message: "Багадаа 3 зургийн URL оруулах шаардлагатай." });
    }

    try {
        const newReport = await pool.query(
            "INSERT INTO order_reports (order_id, description, images) VALUES ($1, $2, $3) RETURNING *",
            [order_id, description, images] // Postgres TEXT[] руу шууд массив орно
        );

        // Захиалгын төлөвийг шинэчлэх
        await pool.query("UPDATE orders SET status = 'Дууссан' WHERE id = $1", [order_id]);

        res.status(201).json(newReport.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Тайлан хадгалахад серверийн алдаа гарлаа." });
    }
});

/**
 * 2. ТАЙЛАН БҮХЭЛД НЬ ШИНЭЧЛЭХ (PUT)
 * Зураг устгах, нэмэх үйлдлийг Frontend дээр массиваа бэлдээд энд явуулна.
 */
router.put('/:order_id', verifyToken, async (req, res) => {
    const { order_id } = req.params;
    const { description, images } = req.body;

    try {
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
        res.status(500).json({ error: "Шинэчлэхэд алдаа гарлаа." });
    }
});

/**
 * 3. НЭГ ШИРХЭГ ЗУРГИЙГ СОЛИХ (PATCH)
 * Тодорхой индекс дээрх зургийн URL-ыг солих.
 */
router.patch('/:order_id/update-image', verifyToken, async (req, res) => {
    const { order_id } = req.params;
    const { index, new_url } = req.body; 

    if (index === undefined || !new_url) {
        return res.status(400).json({ message: "Индекс болон шинэ URL дутуу байна." });
    }

    try {
        // Postgres массив 1-ээс эхэлдэг тул индекс дээр 1-ийг нэмнэ
        const dbIndex = parseInt(index) + 1;
        
        const result = await pool.query(
            `UPDATE order_reports SET images[${dbIndex}] = $1 WHERE order_id = $2 RETURNING *`,
            [new_url, order_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Тайлан олдсонгүй." });
        }

        res.json({ message: "Зураг амжилттай солигдлоо.", report: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Зураг солиход алдаа гарлаа." });
    }
});

/**
 * 4. ТАЙЛАН АВАХ (GET)
 */
router.get('/:order_id', verifyToken, async (req, res) => {
    try {
        const report = await pool.query("SELECT * FROM order_reports WHERE order_id = $1", [req.params.order_id]);
        if (report.rows.length > 0) {
            res.json(report.rows[0]); // images нь хэдийн массив ирнэ
        } else {
            res.status(404).json({ message: "Тайлан олдсонгүй" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Серверийн алдаа");
    }
});

/**
 * 5. ТАЙЛАН УСТГАХ (DELETE)
 */
router.delete('/:order_id', verifyToken, async (req, res) => {
    const { order_id } = req.params;
    try {
        const result = await pool.query("DELETE FROM order_reports WHERE order_id = $1", [order_id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Устгах тайлан олдсонгүй." });
        }

        // Захиалгын төлөвийг буцааж "Хүлээгдэж байна" болгох
        await pool.query("UPDATE orders SET status = 'Хүлээгдэж байна' WHERE id = $1", [order_id]);
        
        res.json({ message: "Тайлан амжилттай устлаа" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Устгахад алдаа гарлаа." });
    }
});

module.exports = router;