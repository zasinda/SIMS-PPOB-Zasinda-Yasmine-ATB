import React, { useEffect, useState } from 'react';
import api from '../services/api';
import avatar from '../assets/ProfilePhoto.png';

// memuat data pengguna yg login
const User = () => {
  const [profile, setProfile] = useState({});
  const [balance, setBalance] = useState(null);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const profileResponse = await api.get('/profile', { headers });
        const balanceResponse = await api.get('/balance', { headers });
        setProfile(profileResponse.data.data);
        setBalance(balanceResponse.data.data.balance);
      } catch (error) {
        console.error('Gagal mengambil data profil atau saldo:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Informasi Pengguna */}
        <div className="flex items-center space-x-4">
          <img
            src={
              profile.profile_image && profile.profile_image !== 'null'
                ? profile.profile_image
                : avatar
            }
            onError={(e) => (e.target.src = avatar)}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <p className="text-gray-600">Selamat datang,</p>
            <h1 className="text-2xl font-semibold">
              {profile.first_name ?? 'Pengguna'} {profile.last_name ?? ''}
            </h1>
          </div>
        </div>

        {/* Informasi Saldo */}
        <div className="bg-red-500 text-white px-6 py-4 rounded-xl w-[850px]">
          <p className="text-sm">Saldo anda</p>
          <p className="text-3xl font-semibold">
            Rp{' '}
            {balance !== null
              ? showBalance
                ? balance.toLocaleString('id-ID')
                : '•'.repeat(balance.toString().length)
              : '••••••••'}
          </p>

          {/* Button Toggle */}
          <button
            onClick={() => setShowBalance((prev) => !prev)}
            className="mt-2 flex items-center text-sm text-white hover:opacity-80"
          >
            {showBalance ? 'Tutup Saldo' : 'Lihat Saldo'}
            {showBalance ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.03-10-9s4.477-9 10-9c1.318 0 2.57.26 3.712.725M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm9 0c0 5-4.477 9-10 9S4 17 4 12 8.477 3 14 3s10 4 10 9z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
