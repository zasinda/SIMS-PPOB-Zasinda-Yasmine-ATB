import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

import Header from '../components/Header';
import User from '../components/User';

const Dashboard = () => {
  // ini state uat data layanan dan promo
  const [services, setServices] = useState([]);
  const [banners, setBanners] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    // untuk ambil data layanan dan banner awal
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Token tidak ditemukan.');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [serviceRes, bannerRes] = await Promise.all([
          api.get('/services', { headers }),
          api.get('/banner', { headers }),
        ]);

        setServices(serviceRes.data.data);
        setBanners(bannerRes.data.data);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />

      <main className="px-6 py-10 max-w-screen-xl mx-auto">
        {/* buat nampilin info pengguna di dashboard */}
        <User />

        {/* Layanan buat pengguna */}
        <div className="grid grid-cols-6 gap-4">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => navigate(`/layanan/${service.service_code}`)}
              className="flex flex-col items-center focus:outline-none"
            >
              <img
                src={service.service_icon}
                alt={service.service_name}
                className="w-12 h-12 mb-1"
              />
              <span className="text-sm text-center">{service.service_name}</span>
            </button>
          ))}
        </div>

        {/* Promo menarik aplikasi */}
        <h2 className="mt-10 mb-4 text-lg font-semibold">Temukan promo menarik</h2>
        <div className="overflow-x-auto flex space-x-4">
          {banners.map((banner, index) => (
            <img
              key={index}
              src={banner.banner_image}
              alt={`Banner ${index + 1}`}
              className="rounded-xl w-72 h-36 object-cover flex-shrink-0"
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
