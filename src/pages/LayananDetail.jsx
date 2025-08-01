import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdAccountBalanceWallet } from 'react-icons/md';
import api from '../services/api';
import Header from '../components/Header';
import User from '../components/User';

const LayananDetail = () => {
  const { code } = useParams(); // ambil kode layanan dari url
  const navigate = useNavigate(); // buat pindah halaman

  // state buat nyimpen data dan status
  const [service, setService] = useState(null); // data layanan
  const [loading, setLoading] = useState(true); // status loading
  const [amount, setAmount] = useState(''); // nominal yang diinput user
  const [showModal, setShowModal] = useState(false); // buka/tutup modal konfirmasi
  const [submitting, setSubmitting] = useState(false); // status saat submit
  const [paymentStatus, setPaymentStatus] = useState(null); // hasil pembayaran

  // ambil data layanan berdasarkan kode
  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await api.get('/services', { headers });
        const found = response.data.data.find(
          (item) => item.service_code.toLowerCase() === code.toLowerCase()
        );
        setService(found || null); // simpen datanya kalo ketemu
      } catch (err) {
        console.error('gagal mengambil layanan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [code]);

  // handle proses pembayaran
  const handlePayment = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const payload = {
        service_code: service.service_code,
        amount: parseInt(amount.replace(/\./g, '')), // hapus titik biar jadi angka
      };
      await api.post('/transaction', payload, { headers });
      setPaymentStatus('success'); // berhasil
    } catch (error) {
      setPaymentStatus('error'); // gagal
    } finally {
      setSubmitting(false);
      setShowModal(false);
    }
  };

  // buat format angka ribuan pake titik
  const formatNumber = (value) => {
    const onlyNums = value.replace(/\D/g, ''); // ambil angka aja
    return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // tambahin titik tiap ribuan
  };

  // tampilin loading dulu kalo data belum siap
  if (loading) return <div className="p-6">Memuat data layanan...</div>;
  if (!service) return <div className="p-6 text-red-500">Layanan tidak ditemukan.</div>;

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="px-6 py-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col gap-6">
          <User />

          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">Pembayaran</h2>

            {/* info layanan */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={service.service_icon}
                alt={service.service_name}
                className="w-6 h-6"
              />
              <span className="font-semibold text-lg">{service.service_name}</span>
            </div>

            {/* input nominal */}
            <div className="relative mb-6">
              <MdAccountBalanceWallet
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(formatNumber(e.target.value))}
                placeholder="contoh: 10.000"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* tombol bayar */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
              disabled={!amount}
            >
              bayar
            </button>
          </div>
        </div>
      </div>

      {/* modal konfirmasi pembayaran */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl px-6 py-8 text-center shadow-xl w-[90%] max-w-sm">
            <div className="flex justify-center mb-4">
              <MdAccountBalanceWallet
                className="text-red-600"
                size={48}
                data-testid="wallet-icon"
              />
            </div>
            <p className="text-sm text-gray-500 mb-1">
              Beli {service.service_name.toLowerCase()} senilai
            </p>
            <p className="text-2xl font-bold text-black mb-6">
              Rp{parseInt(amount.replace(/\./g, '')).toLocaleString('id-ID')}
            </p>
            <button
              onClick={handlePayment}
              disabled={submitting}
              className="block w-full text-red-600 font-semibold mb-3"
            >
              Ya, lanjutkan bayar
            </button>
            <button
              onClick={() => setShowModal(false)}
              disabled={submitting}
              className="block w-full text-gray-500"
            >
              Batalkan
            </button>
          </div>
        </div>
      )}

      {/* hasil transaksi muncul setelah submit */}
      {paymentStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl px-6 py-8 text-center shadow-xl w-[90%] max-w-sm">
            <div className="flex justify-center mb-4">
              {paymentStatus === 'success' ? (
                <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
                </div>
              ) : (
                <div className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">×</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-2">Pembayaran sebesar</p>
            <p className="text-2xl font-bold text-black mb-2">
              Rp{parseInt(amount.replace(/\./g, '')).toLocaleString('id-ID')}
            </p>
            <p className="text-md font-semibold text-gray-800 mb-6">
              {paymentStatus === 'success' ? 'berhasil!' : 'gagal'}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-red-600 font-semibold"
            >
              Kembali ke beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayananDetail;