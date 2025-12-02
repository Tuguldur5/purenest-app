const jwt = require('jsonwebtoken');
// ⚠️ JWT_SECRET-г орчны хувьсагчаас дуудна.
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_HIGHLY_SECURE_SECRET_KEY_123'; 

// 1. JWT Баталгаажуулалтын Middleware (Энгийн хэрэглэгчийн API-д хэрэгтэй)
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Нэвтрэлт шаардлагатай. Token олдсонгүй.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id: ..., role: ... }
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token хүчингүй эсвэл хугацаа нь дууссан.' });
    }
};

// 2. АДМИН ЭРХ ШАЛГАХ MIDDLEWARE (Админ API-д хэрэгтэй)
const isAdminMiddleware = (req, res, next) => {
    // Эхлээд JWT-г шалгана
    authMiddleware(req, res, () => {
        // authMiddleware амжилттай бол req.user-т мэдээлэл ирсэн байна
        if (req.user && req.user.role === 'admin') {
            next(); // Админ бол дараагийн функц рүү шилжүүлнэ
        } else {
            // Админ биш бол 403 (Хориглосон) хариу өгнө
            return res.status(403).json({ error: 'Зөвхөн админ эрхээр хандах боломжтой.' });
        }
    });
};

module.exports = { authMiddleware, isAdminMiddleware };