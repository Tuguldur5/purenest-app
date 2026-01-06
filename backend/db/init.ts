// src/db/init.ts
import { Pool, PoolClient } from "pg";

// Docker эсвэл .env-ээс мэдээллээ авна
export const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "db", // Docker-т 'db', local-д 'localhost'
  database: process.env.DB_NAME || "purenest",
  password: process.env.DB_PASSWORD || "12345678",
  port: 5432,
});

export async function initDb(): Promise<void> {
  let client: PoolClient | undefined;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    // 1. Users table (OTP багануудыг нэмсэн)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          full_name VARCHAR(120) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'user', 
          phone VARCHAR(30),
          otp_code VARCHAR(10),
          otp_expires TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 2. Orders table (status, date, total_price нэмсэн)
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE SET NULL,
          service VARCHAR(100) NOT NULL,
          public_area_size INT,
          apartments INT,
          floors INT,
          lifts INT,
          rooms INT,
          frequency VARCHAR(50),
          city VARCHAR(100),
          district VARCHAR(100),
          khoroo VARCHAR(100),
          address TEXT,
          total_price INT,
          status VARCHAR(100) DEFAULT 'Хүлээгдэж байна',
          phone_number VARCHAR(30),
          date DATE,
          created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 3. Pricing Settings table (monthly_discount нэмсэн)
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing_settings (
          id SERIAL PRIMARY KEY,
          office_price_per_sqm NUMERIC DEFAULT 20000,
          public_area_price_per_sqm NUMERIC DEFAULT 25000,
          suh_apartment_base NUMERIC DEFAULT 100000,
          suh_floor_price NUMERIC DEFAULT 20000,
          suh_lift_price NUMERIC DEFAULT 10000,
          suh_room_price NUMERIC DEFAULT 5000,
          daily_discount NUMERIC DEFAULT 0.86, 
          weekly_discount NUMERIC DEFAULT 0.96,
          biweekly_discount NUMERIC DEFAULT 0.95,
          monthly_discount NUMERIC DEFAULT 0.9
      );
    `);

    // Pricing Settings өгөгдөл байхгүй бол анхны утгыг оруулах (Нэмэлт)
    const pricingCheck = await client.query("SELECT id FROM pricing_settings LIMIT 1");
    if (pricingCheck.rowCount === 0) {
      await client.query(`
        INSERT INTO pricing_settings (id) VALUES (1);
      `);
    }

    await client.query("COMMIT");
    console.log("✅ Өгөгдлийн сан шинэчлэгдэж, бүх баганууд бэлэн боллоо.");
  } catch (err) {
    if (client) await client.query("ROLLBACK");
    console.error("❌ DB Init алдаа:", err);
    throw err;
  } finally {
    if (client) client.release();
  }
}