import axios from 'axios';

const api = axios.create({
  baseURL: 'https://take-home-test-api.nutech-integrasi.com',
});

// buat namabahin token ke header auth secara otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
