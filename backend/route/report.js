// routes/reports.js
const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const { verifyToken } = require('../middleware/index.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer тохиргоо
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/reports';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, name);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB хүртэл зураг
    fileFilter: (req, file, cb) => {
        const allowed = ['.png', '.jpg', '.jpeg', '.webp'];
        if (!allowed.includes(path.extname(file.originalname).toLowerCase())) {
            return cb(new Error('Зөвхөн зураг upload хийж болно'));
        }
        cb(null, true);
    }
});

// Тайлан нэмэх
router.post('/', verifyToken, upload.array('images', 10), async (req, res) => {
    const { order_id, description } = req.body;
    if (!req.files || req.files.length < 3) {
        return res.status(400).json({ message: "Багадаа 3 зураг оруулах шаардлагатай." });
    }

    const images = req.files.map(f => f.filename); // файлын нэрсийг хадгална

    try {
        const newReport = await pool.query(
            "INSERT INTO order_reports (order_id, description, images) VALUES ($1, $2, $3) RETURNING *",
            [order_id, description, JSON.stringify(images)]
        );

        await pool.query("UPDATE orders SET status = 'Дууссан' WHERE id = $1", [order_id]);

        res.status(201).json(newReport.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Серверийн алдаа");
    }
});

// Тайлан update
router.put('/:order_id', verifyToken, upload.array('images', 10), async (req, res) => {
    const { order_id } = req.params;
    const { description } = req.body;

    let images;
    if (req.files && req.files.length > 0) {
        images = req.files.map(f => f.filename);
        if (images.length < 3) return res.status(400).json({ message: "Багадаа 3 зураг оруулах шаардлагатай." });
    }

    try {
        const updatedReport = await pool.query(
            `UPDATE order_reports 
             SET description = COALESCE($1, description), 
                 images = COALESCE($2, images),
                 updated_at = NOW()
             WHERE order_id = $3 
             RETURNING *`,
            [description, images ? JSON.stringify(images) : undefined, order_id]
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

// Тайлан авах
router.get('/:order_id', verifyToken, async (req, res) => {
    try {
        const report = await pool.query("SELECT * FROM order_reports WHERE order_id = $1", [req.params.order_id]);
        if (report.rows.length > 0) {
            // images-г JSON.parse хийнэ
            const data = report.rows[0];
            data.images = JSON.parse(data.images);
            res.json(data);
        } else {
            res.status(404).json({ message: "Тайлан олдсонгүй" });
        }
    } catch (err) {
        res.status(500).send("Серверийн алдаа");
    }
});

// Тайлан устгах
router.delete('/:order_id', verifyToken, async (req, res) => {
    const { order_id } = req.params;
    try {
        await pool.query("DELETE FROM order_reports WHERE order_id = $1", [order_id]);
        await pool.query("UPDATE orders SET status = 'Хүлээгдэж байна' WHERE id = $1", [order_id]);
        res.json({ message: "Тайлан амжилттай устлаа" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;