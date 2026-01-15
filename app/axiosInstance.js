import axios from 'axios';

// 1. Бакэнд хаягийг тодорхойлох
// Vercel-ийн Environment Variable-аас харна, байхгүй бол шууд Render-ийн хаягийг ашиглана
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://purenest-app.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Хэрэв та Cookie эсвэл Session (NextAuth) ашиглаж байгаа бол энэ маш чухал
  withCredentials: true, 
  // Хүсэлт хүлээх хугацаа (заавал биш ч байвал сайн)
  timeout: 10000, 
});

// 2. Request Interceptor (Хүсэлт явахаас өмнө хийх үйлдэл)
api.interceptors.request.use(
  (config) => {
    // Жишээ нь: LocalStorage-аас Token авч Header-т нэмэх бол энд бичнэ
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Хариу ирэх үед алдааг барьж авах)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Хэрэв 401 (Unauthorized) алдаа ирвэл нэвтрэх хуудас руу шилжүүлэх гэх мэт
    if (error.response?.status === 401) {
      // логик бичиж болно
    }
    
    return Promise.reject(error);
  }
);

export default api;