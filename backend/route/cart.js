// routes/cart.js

// 1. Сагсны мэдээллийг хадгалах (Sync)
router.post('/sync', authenticateToken, async (req, res) => {
    const { items } = req.body; // Frontend-ээс ирэх [{product_id, quantity}, ...]
    const userId = req.user.id;

    try {
        // Хэрэглэгчийн сагсыг олох эсвэл шинээр үүсгэх
        let cart = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
        let cartId;

        if (cart.rows.length === 0) {
            const newCart = await pool.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
            cartId = newCart.rows[0].id;
        } else {
            cartId = cart.rows[0].id;
        }

        // Хуучин сагсны барааг устгаад шинийг хадгалах (Энгийн арга)
        await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

        for (const item of items) {
            await pool.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
                [cartId, item.id, item.quantity]
            );
        }

        res.json({ message: "Сагс амжилттай синхрончлогдлоо" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Сагсны мэдээллийг татаж авах
router.get('/', authenticateToken, async (req, res) => {
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
        res.status(500).json({ error: err.message });
    }
});