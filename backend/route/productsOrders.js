const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const { verifyToken}  = require('../middleware/index.js');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// --- ЗАХИАЛГА ҮҮСГЭХ + МЭЙЛ ИЛГЭЭХ ---
router.post('/create', verifyToken, async (req, res) => {
    const { full_name, phone_number, email, address, items, total_amount } = req.body;
    const user_id = req.user.id;

    try {
        await pool.query('BEGIN');

        // 1. Захиалга бүртгэх
        const orderRes = await pool.query(
            `INSERT INTO product_orders (user_id, full_name, phone_number, email, address, total_amount, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'Хүлээгдэж байна') RETURNING id`,
            [user_id, full_name, phone_number, email, address || 'Хаяг өгөөгүй', total_amount]
        );
        const orderId = orderRes.rows[0].id;

        // 2. Захиалгын бараануудыг бүртгэх
        for (let item of items) {
            await pool.query(
                `INSERT INTO product_order_items (order_id, product_id, quantity, unit_price, subtotal) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [orderId, item.id, item.quantity, item.price, item.quantity * item.price]
            );
        }

        await pool.query('COMMIT');

        // 3. Resend-ээр Компани руу мэйл илгээх
        const itemsList = items.map(i => `<li>${i.name} - ${i.quantity}ш (${i.price.toLocaleString()}₮)</li>`).join('');
        
        await resend.emails.send({
            from: 'PureNest <onboarding@resend.dev>', // Өөрийн домайн байвал солиорой
            to: 'tuguldur8000@gmail.com', // Танай компанийн мэйл
            subject: `Шинэ барааны захиалга ирлээ: #${orderId}`,
            html: `
                <h1>Шинэ барааны захиалгын мэдээлэл</h1>
                <p><strong>Захиалагч:</strong> ${full_name}</p>
                <p><strong>Утас:</strong> ${phone_number}</p>
                <p><strong>Мэйл:</strong> ${email || 'Байхгүй'}</p>
                <p><strong>Хаяг:</strong> ${address || 'Хаяг өгөөгүй'}</p>
                <hr/>
                <h3>Захиалсан бараанууд:</h3>
                <ul>${itemsList}</ul>
                <p><strong>Нийт дүн:</strong> ${total_amount.toLocaleString()} ₮</p>
            `
        });

        res.status(201).json({ message: "Захиалга амжилттай", orderId });
    } catch (err) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: "Алдаа гарлаа" });
    }
});

// --- ХЭРЭГЛЭГЧ ЗАХИАЛГА УСТГАХ (ЦУЦЛАХ) ---
router.delete('/cancel/:id', verifyToken, async (req, res) => {
    const order_id = req.params.id;
    const user_id = req.user.id;

    try {
        // Зөвхөн 'Хүлээгдэж байна' төлөвтэй захиалгыг л устгах боломжтой болгох
        const checkOrder = await pool.query(
            "SELECT status FROM product_orders WHERE id = $1 AND user_id = $2",
            [order_id, user_id]
        );

        if (checkOrder.rows.length === 0) {
            return res.status(404).json({ error: "Захиалга олдсонгүй" });
        }

        if (checkOrder.rows[0].status !== 'Хүлээгдэж байна') {
            return res.status(400).json({ error: "Баталгаажсан захиалгыг устгах боломжгүй" });
        }

        // Захиалгыг устгах (ON DELETE CASCADE байгаа бол items хамт устна)
        await pool.query("DELETE FROM product_orders WHERE id = $1", [order_id]);
        
        res.json({ message: "Захиалга амжилттай цуцлагдлаа" });
    } catch (err) {
        res.status(500).json({ error: "Устгахад алдаа гарлаа" });
    }
});
// --- 2. ХЭРЭГЛЭГЧ ӨӨРИЙН ЗАХИАЛГЫН ТҮҮХИЙГ ХАРАХ (GET) ---
router.get('/my-orders', verifyToken, async (req, res) => {
    const user_id = req.user.id;
    try {
        const result = await pool.query(
            `SELECT po.*, 
             (SELECT json_agg(items) FROM 
                (SELECT p.name, poi.quantity, poi.unit_price FROM product_order_items poi 
                 JOIN products p ON poi.product_id = p.id WHERE poi.order_id = po.id) items
             ) as products
             FROM product_orders po 
             WHERE po.user_id = $1 ORDER BY po.created_at DESC`,
            [user_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Түүх уншихад алдаа гарлаа" });
    }
});

// --- 3. АДМИН БҮХ ЗАХИАЛГЫГ ХАРАХ (GET) ---
router.get('/admin/all', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT po.*, u.email as user_email,
            STRING_AGG(p.name || ' (' || poi.quantity || 'ш)', ', ') as items_summary
            FROM product_orders po
            LEFT JOIN users u ON po.user_id = u.id
            LEFT JOIN product_order_items poi ON po.id = poi.order_id
            LEFT JOIN products p ON poi.product_id = p.id
            GROUP BY po.id, u.email
            ORDER BY po.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Серверийн алдаа" });
    }
});

// --- 4. АДМИН ТӨЛӨВ ӨӨРЧЛӨХ (PUT) ---
router.put('/admin/update-status/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query(
            "UPDATE product_orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
            [status, id]
        );
        res.json({ message: "Төлөв шинэчлэгдлээ" });
    } catch (err) {
        res.status(500).json({ error: "Шинэчлэхэд алдаа гарлаа" });
    }
});

module.exports = router;