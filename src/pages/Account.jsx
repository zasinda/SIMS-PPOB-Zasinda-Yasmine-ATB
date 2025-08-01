import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import avatar from '../assets/ProfilePhoto.png';
import Header from '../components/Header';

const Account = () => {
  const [profile, setProfile] = useState({
    email: '',
    first_name: '',
    last_name: '',
    profile_image: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // ambil data dari api
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile', { headers });
        const data = res.data.data;
        setProfile(data);

        // buat menampilkan foto profile
        if (data.profile_image && data.profile_image !== 'null') {
          setPreviewImage(data.profile_image);
        }
      } catch (err) {
        console.error('Gagal mengambil profil:', err);
      }
    };
    fetchProfile();
  }, []);

  // fungsi untuk logout dgn hapus token dan di arahkan ke halaman login
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      <Header />

      <div className="flex flex-col items-center p-6">
        <div className="relative">
          <img
            src={previewImage || avatar}
            onError={(e) => (e.target.src = avatar)}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border"
          />
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 border">
            ✎
          </label>
        </div>

        <h2 className="text-2xl font-semibold mt-4">
          {profile.first_name} {profile.last_name}
        </h2>

        <div className="w-full max-w-md mt-6 space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm">Nama Depan</label>
            <input
              type="text"
              value={profile.first_name}
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm">Nama Belakang</label>
            <input
              type="text"
              value={profile.last_name}
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <button
            onClick={() => navigate('/edit-profile')}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Edit Profil
          </button>

          <button
            onClick={handleLogout}
            className="w-full border border-red-500 text-red-500 py-2 rounded hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Account;