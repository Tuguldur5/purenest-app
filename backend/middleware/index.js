// middleware/index.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "YOUR_HIGHLY_SECURE_SECRET_KEY_123";

// -----------------------------
// 🔐 AUTH MIDDLEWARE
// -----------------------------
function authMiddleware(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. Token missing." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // user info хадгалах
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
}

module.exports = {
    authMiddleware
};
