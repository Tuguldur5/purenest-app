const { Pool } = require("pg");
require('dotenv').config(); // .env файлыг уншихын тулд заавал байх ёстой

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
    // Хэрэв DATABASE_URL байвал түүнийг ашиглана (Render/Supabase-д зориулагдсан)
    // Байхгүй бол таны локал салангид мэдээллүүдийг ашиглана
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    
    // Зөвхөн Production (Render) дээр SSL ашиглана, локал дээр ашиглахгүй
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

module.exports = pool;