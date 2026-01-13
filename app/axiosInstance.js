import axios from 'axios';

const api = axios.create({
  // Хэрэв локал дээр ажиллаж байвал localhost, онлайнд байвал Render-ийн хаяг ашиглана
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://tanii-backend.onrender.com' 
    : 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;