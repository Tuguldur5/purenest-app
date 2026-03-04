const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const { verifyToken } = require('../middleware/index.js');

// 1. Хэрэглэгчийн сагсны мэдээллийг татаж авах
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await pool.query(`
            SELECT p.*, ci.quantity 
            FROM cart_items ci
            JOIN carts c ON ci.cart_id = c.id
            JOIN products p ON ci.product_id = p.id
            WHERE c.user_id = $1
        `, [userId]);

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Сагсны мэдээлэл татахад алдаа гарлаа" });
    }
});

// 2. Сагсыг өгөгдлийн сантай синхрончлох (Хадгалах)
router.post('/sync', verifyToken, async (req, res) => {
    const { items } = req.body; // [{id: 1, quantity: 2}, ...]
    const userId = req.user.id;

    try {
        // Юуны өмнө хэрэглэгчид сагс байгаа эсэхийг шалгах
        let cart = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
        let cartId;

        if (cart.rows.length === 0) {
            // Сагс байхгүй бол шинээр үүсгэх
            const newCart = await pool.query(
                'INSERT INTO carts (user_id) VALUES ($1) RETURNING id', 
                [userId]
            );
            cartId = newCart.rows[0].id;
        } else {
            cartId = cart.rows[0].id;
        }

        // Хуучин сагсны бараануудыг устгах (Шинэчилж байгаа учраас)
        await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

        // Шинэ бараануудыг нэмэх
        if (items && items.length > 0) {
            const insertValues = items.map(item => `(${cartId}, ${item.id}, ${item.quantity})`).join(',');
            await pool.query(`
                INSERT INTO cart_items (cart_id, product_id, quantity) 
                VALUES ${insertValues}
            `);
        }

        res.json({ message: "Сагс амжилттай хадгалагдлаа" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Сагс синхрончлоход алдаа гарлаа" });
    }
});

module.exports = router;