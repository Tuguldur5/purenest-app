// Wishlist-д бараа нэмэх
const express = require('express'); // 1. Express-ийг дуудах
const router = express.Router();    // 2. router-ийг зарлах
const { verifyToken } = require('../middleware/index.js'); // middleware-ийн замыг шалгаарай

router.post('/add', verifyToken, async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;
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

// Хадгалсан бараануудыг авах
router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.* FROM products p
            JOIN wishlist w ON p.id = w.product_id
            WHERE w.user_id = $1
        `, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Сагсны бүх барааг багцаар нь хадгалах
router.post('/bulk-add', verifyToken, async (req, res) => {
    const { product_ids } = req.body; // Жишээ нь: [1, 5, 12]
    const userId = req.user.id;

    if (!Array.isArray(product_ids) || product_ids.length === 0) {
        return res.status(400).json({ error: "Барааны жагсаалт хоосон байна." });
    }

    try {
        // Олон мөр нэг дор оруулах SQL
        const values = product_ids.map(id => `(${userId}, ${id})`).join(',');
        
        await pool.query(`
            INSERT INTO wishlist (user_id, product_id) 
            VALUES ${values} 
            ON CONFLICT DO NOTHING
        `);

        res.json({ message: "Бүх бараа хадгалагдлаа" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Хадгалахад алдаа гарлаа" });
    }
});
w
// Хадгалсан барааг устгах
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [req.user.id, req.params.id]);
        res.json({ message: "Устгагдлаа" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 