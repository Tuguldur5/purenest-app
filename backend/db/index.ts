import express from 'express';

import { initDb } from '../db/init'; // Таны үүсгэсэн файл

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 1. Сервер асахын өмнө DB хүснэгтүүдийг шалгаж, үүсгэнэ
    await initDb();
    
    // 2. Дараа нь серверээ сонсож эхэлнэ
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error);
    process.exit(1); // Алдаа гарвал процессыг зогсооно
  }
}

startServer();