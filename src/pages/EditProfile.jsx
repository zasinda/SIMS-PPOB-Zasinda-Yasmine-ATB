import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import defaultAvatar from '../assets/ProfilePhoto.png';
import Header from '../components/Header';

const EditProfile = () => {
  // ini state untuk simpen data profil dan foto
  const [profile, setProfile] = useState({
    email: '',
    first_name: '',
    last_name: '',
    profile_image: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // mengambil roken dan menyiapkan headers untuk req
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {

    // ambil data profil
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile', { headers });
        const data = res.data.data;
        setProfile(data);

        // menampilkan data profil
        if (data.profile_image && data.profile_image !== 'null') {
          setPreviewImage(data.profile_image);
        }
      } catch (err) {
        console.error('Gagal mengambil profil:', err);
      }
    };
    fetchProfile();
  }, []);

  // untuk perubahan foto profil
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024) {
      alert('Ukuran gambar maksimal 100 KB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.put('/profile/image', formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      // preview foto dari file lokal
      const imageURL = URL.createObjectURL(file);
      setPreviewImage(imageURL);
    } catch (error) {
      console.error('Gagal upload gambar:', error);
    }
  };

  // untuk menyimpan perubahan data
  const handleUpdateProfile = async () => {
    try {
      await api.put(
        '/profile/update',
        {
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
        },
        { headers }
      );
      alert('Profil berhasil diperbarui');
      navigate('/akun');
    } catch (err) {
      console.error('Gagal memperbarui profil:', err);
      alert('Gagal memperbarui profil');
    }
  };

  return (
    <>
      <Header />

      <div className="flex flex-col items-center p-6">
        <div className="relative">
          <img
            src={previewImage || defaultAvatar}
            onError={(e) => (e.target.src = defaultAvatar)}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border"
          />
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer border">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            ✎
          </label>
        </div>

        {/* nama pengguna */}
        <h2 className="text-2xl font-semibold mt-4">
          {profile.first_name} {profile.last_name}
        </h2>

        {/* Form edit */}
        <div className="w-full max-w-md mt-6 space-y-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm">Nama Depan</label>
            <input
              type="text"
              value={profile.first_name}
              onChange={(e) =>
                setProfile({ ...profile, first_name: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm">Nama Belakang</label>
            <input
              type="text"
              value={profile.last_name}
              onChange={(e) =>
                setProfile({ ...profile, last_name: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* button update */}
          <button
            onClick={handleUpdateProfile}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Simpan
          </button>
        </div>
      </div>
    </>
  );
};

export default EditProfile;