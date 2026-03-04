const express = require('express');
const router = express.Router();
const pool = require('../db.js'); // 3. pool-ийг заавал дуудах ёстой
const { verifyToken } = require('../middleware/index.js');

// 1. Хадгалсан бараануудыг авах (GET)
router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.* FROM products p
            JOIN wishlist w ON p.id = w.product_id
            WHERE w.user_id = $1
            ORDER BY w.id DESC
        `, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error("Wishlist GET error:", err.message);
        res.status(500).json({ error: "Жагсаалтыг авахад алдаа гарлаа" });
    }
});

// 2. Ганц бараа хадгалах (POST)
router.post('/add', verifyToken, async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    if (!product_id) {
        return res.status(400).json({ error: "Бүтээгдэхүүний ID шаардлагатай" });
    }

    try {
        await pool.query(
            'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [user_id, product_id]
        );
        res.json({ message: "Бараа хадгалагдлаа" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Сагсны бүх барааг багцаар нь хадгалах (POST /bulk-add)
router.post('/bulk-add', verifyToken, async (req, res) => {
    const { product_ids } = req.body; 
    const userId = req.user.id;

    if (!Array.isArray(product_ids) || product_ids.length === 0) {
        return res.status(400).json({ error: "Барааны жагсаалт хоосон байна." });
    }

    try {
        // SQL Injection-оос сэргийлж dynamic query бэлдэх
        const values = [];
        const placeholders = product_ids.map((id, index) => {
            values.push(userId, id);
            return `($${index * 2 + 1}, $${index * 2 + 2})`;
        }).join(',');

        const query = `
            INSERT INTO wishlist (user_id, product_id) 
            VALUES ${placeholders} 
            ON CONFLICT DO NOTHING
        `;

        await pool.query(query, values);
        res.json({ message: "Сонгосон бүх бараа хадгалагдлаа" });
    } catch (err) {
        console.error("Bulk add error:", err.message);
        res.status(500).json({ error: "Хадгалахад алдаа гарлаа" });
    }
});

// 4. Хадгалсан барааг устгах (DELETE)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', 
            [req.user.id, req.params.id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Бараа олдсонгүй" });
        }
        
        res.json({ message: "Устгагдлаа" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Toggle хийх (Хэрэв байвал устгах, байхгүй бол нэмэх) - Сонголтоор
router.post('/toggle', verifyToken, async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    try {
        const check = await pool.query(
            'SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2',
            [user_id, product_id]
        );

        if (check.rows.length > 0) {
            await pool.query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [user_id, product_id]);
            return res.json({ action: "removed", message: "Устгагдлаа" });
        } else {
            await pool.query('INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)', [user_id, product_id]);
            return res.json({ action: "added", message: "Хадгалагдлаа" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;