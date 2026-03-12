const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const { verifyToken } = require('../middleware/index.js');

// 1. ТАЙЛАН ХАДГАЛАХ ЭСВЭЛ ШИНЭЧЛЭХ (POST)
router.post('/', verifyToken, async (req, res) => {
    const { order_id, description, images } = req.body;

    if (!order_id || !Array.isArray(images) || images.length < 3) {
        return res.status(400).json({ error: "Мэдээлэл дутуу эсвэл зураг 3-аас бага байна." });
    }

    // Transaction ашиглах нь найдвартай (Алдаа гарвал аль нь ч өөрчлөгдөхгүй)
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Тайлан оруулах эсвэл шинэчлэх
        const result = await client.query(
            `INSERT INTO order_reports (order_id, description, images) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (order_id) 
             DO UPDATE SET 
                description = EXCLUDED.description, 
                images = EXCLUDED.images, 
                updated_at = NOW() 
             RETURNING *`,
            [order_id, description, images]
        );
        
        // Захиалгын төлөвийг "Дууссан" болгож, has_report-ыг true болгох
        // ЭНД ХАМГИЙН ЧУХАЛ ӨӨРЧЛӨЛТ ОРЖ БАЙНА
        await client.query(
            "UPDATE orders SET status = 'Дууссан', hasReport = true WHERE id = $1", 
            [order_id]
        );
        
        await client.query('COMMIT');
        res.status(200).json(result.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: "Серверийн алдаа" });
    } finally {
        client.release();
    }
});

// 2. ТУХАЙН ЗАХИАЛГЫН ТАЙЛАНГ АВАХ (GET)
router.get('/:order_id', verifyToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM order_reports WHERE order_id = $1", [req.params.order_id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: "Тайлан олдсонгүй" });
        }
    } catch (err) {
        res.status(500).json({ error: "Алдаа гарлаа" });
    }
});

// 3. ТАЙЛАН УСТГАХ (DELETE)
router.delete('/:order_id', verifyToken, async (req, res) => {
    const { order_id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const result = await client.query("DELETE FROM order_reports WHERE order_id = $1", [order_id]);
        
        if (result.rowCount > 0) {
            // Тайлан устсан бол has_report-ыг буцаагаад false болгоно
            await client.query(
                "UPDATE orders SET status = 'Хүлээгдэж байна', hasReport = false WHERE id = $1", 
                [order_id]
            );
            await client.query('COMMIT');
            res.json({ message: "Тайлан амжилттай устлаа" });
        } else {
            res.status(404).json({ message: "Устгах тайлан олдсонгүй" });
        }
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: "Устгахад алдаа гарлаа" });
    } finally {
        client.release();
    }
});

module.exports = router;