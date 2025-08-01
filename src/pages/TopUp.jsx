import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAccountBalanceWallet } from 'react-icons/md';
import api from '../services/api';
import Header from '../components/Header';
import User from '../components/User';

// daftar nominal top up yang bisa langsung diklik
const presetNominals = [10000, 20000, 50000, 100000, 250000, 500000];

const TopUp = () => {
  // state buat nyimpen nilai input top up, tipe modal yang muncul, dan navigasi
  const [nominal, setNominal] = useState('');
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();

  // buat formatting angka ribuan
  const formatNumber = (value) => {
    const onlyNums = value.replace(/\D/g, '');
    return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // ubah nominal ke number (biar bisa dicek valid atau nggak)
  const numericNominal = Number(nominal.replace(/\./g, ''));
  const isValid = numericNominal >= 10000 && numericNominal <= 1000000;

  // kalo user klik tombol preset
  const handlePresetClick = (value) => {
    setNominal(formatNumber(value.toString()));
  };

  // pas klik tombol top up
  const handleTopUp = () => {
    if (isValid) setModalType('confirm'); // tampilkan modal konfirmasi
  };

  // proses top up setelah user confirm
  const confirmTopUp = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await api.post('/topup', { top_up_amount: numericNominal }, { headers });
      setModalType('success'); // kalo sukses munculin modal sukses
    } catch (error) {
      console.error('top up gagal:', error);
      setModalType('error'); // kalo gagal munculin modal error
    }
  };

  const closeModal = () => setModalType(null); // tutup modal
  const goHome = () => {
    setModalType(null);
    navigate('/topup'); // balik ke halaman topup
    window.location.reload(); // refr
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <main className="px-6 py-10 max-w-screen-xl mx-auto">
        <User />

        {/* judul & form input */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Silahkan Masukan <br />
            <span className="text-2xl">Nominal Top Up</span>
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* input manual & tombol top up */}
            <div className="flex flex-col gap-3 w-full md:w-1/2">
              <div className="relative">
                <MdAccountBalanceWallet
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={nominal}
                  onChange={(e) => setNominal(formatNumber(e.target.value))}
                  placeholder="masukan nominal top up"
                  className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <button
                onClick={handleTopUp}
                disabled={!isValid}
                className={`w-full py-2 text-white font-semibold rounded-md ${
                  isValid ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                top up
              </button>
            </div>

            {/* pilihan nominal cepat */}
            <div className="grid grid-cols-3 gap-2 w-full md:w-1/2">
              {presetNominals.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handlePresetClick(amount)}
                  className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 whitespace-nowrap text-sm"
                >
                  Rp{amount.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* modal popup */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[300px] text-center px-6 py-8">
            {/* konfirmasi top up */}
            {modalType === 'confirm' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-red-500 rounded-full p-3">
                    <span className="text-white text-xl">💳</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-1">Anda yakin untuk top up sebesar</p>
                <p className="text-xl font-bold mb-4">
                  Rp{numericNominal.toLocaleString('id-ID')} ?
                </p>
                <button
                  onClick={confirmTopUp}
                  className="text-red-500 font-semibold mb-2 block w-full"
                >
                  Ya, lanjutkan Top Up
                </button>
                <button onClick={closeModal} className="text-gray-400">
                  Batalkan
                </button>
              </>
            )}

            {/* misal sukses */}
            {modalType === 'success' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-green-500 rounded-full p-3">
                    <span className="text-white text-xl">✔</span>
                  </div>
                </div>
                <p className="text-gray-700">Top up sebesar</p>
                <p className="text-xl font-bold">Rp{numericNominal.toLocaleString('id-ID')}</p>
                <p className="mb-4">Berhasil!</p>
                <button onClick={goHome} className="text-red-500 font-semibold">
                  Kembali ke beranda
                </button>
              </>
            )}

            {/* misal error */}
            {modalType === 'error' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-red-500 rounded-full p-3">
                    <span className="text-white text-xl">✖</span>
                  </div>
                </div>
                <p className="text-gray-700">top up sebesar</p>
                <p className="text-xl font-bold">Rp{numericNominal.toLocaleString('id-ID')}</p>
                <p className="mb-4">Gagal</p>
                <button onClick={goHome} className="text-red-500 font-semibold">
                  Kembali ke beranda
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopUp;