import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import User from '../components/User';

// daftar bulan buat filter transaksi
const months = [
  { name: 'Januari', number: 0 },
  { name: 'Februari', number: 1 },
  { name: 'Maret', number: 2 },
  { name: 'April', number: 3 },
  { name: 'Mei', number: 4 },
  { name: 'Juni', number: 5 },
  { name: 'Juli', number: 6 },
  { name: 'Agustus', number: 7 },
  { name: 'September', number: 8 },
  { name: 'Oktober', number: 9 },
  { name: 'November', number: 10 },
  { name: 'Desember', number: 11 },
];

const HistoryTransaction = () => {
  const [history, setHistory] = useState([]); // semua transaksi yang udah diambil
  const [filteredHistory, setFilteredHistory] = useState([]); // transaksi setelah difilter
  const [activeMonth, setActiveMonth] = useState(null); // bulan yang lagi dipilih
  const [offset, setOffset] = useState(0); // buat pagination
  const [saldo, setSaldo] = useState(0); // simpen saldo user
  const limit = 5; // batas transaksi per load

  // ambil data transaksi dari api
  const fetchHistory = async (currentOffset) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await api.get(
        `/transaction/history?limit=${limit}&offset=${currentOffset}`,
        { headers }
      );
      const data = response.data?.data?.records || [];
      const updatedHistory = [...history, ...data]; // gabung data lama + baru
      setHistory(updatedHistory);
      applyFilter(updatedHistory, activeMonth); // filter langsung setelah fetch
    } catch (err) {
      console.error('gagal ambil riwayat:', err);
    }
  };

  // ambil saldo user
  const fetchSaldo = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await api.get('/profile', { headers });
      setSaldo(response.data.data.balance || 0);
    } catch (err) {
      console.error('gagal ambil saldo:', err);
    }
  };

  // fungsi buat filter transaksi berdasarkan bulan
  const applyFilter = (data, month) => {
    if (month === null) {
      setFilteredHistory(data);
    } else {
      const filtered = data.filter((item) => {
        const itemDate = new Date(item.created_on);
        return itemDate.getMonth() === month;
      });
      setFilteredHistory(filtered);
    }
  };

  // pas user klik salah satu bulan
  const handleMonthClick = (monthNumber) => {
    setActiveMonth(monthNumber);
    applyFilter(history, monthNumber);
  };

  // kalo klik "semua transaksi"
  const handleAllClick = () => {
    setActiveMonth(null);
    setFilteredHistory(history);
  };

  // tombol buat load data transaksi selanjutnya
  const handleShowMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchHistory(newOffset);
  };

  // ambil data awal pas halaman dibuka
  useEffect(() => {
    fetchHistory(0);
    fetchSaldo();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <main className="px-8 py-10">
        <User />

        <h2 className="text-xl font-semibold mb-4">Semua Transaksi</h2>

        {/* filter berdasarkan bulan */}
        <div className="flex gap-4 text-sm text-gray-400 mb-6 overflow-x-auto">
          <button
            onClick={handleAllClick}
            className={`font-semibold ${activeMonth === null ? 'text-black' : ''}`}
          >
            Semua Transaksi
          </button>
          {months.slice(2, 8).map((m) => (
            <button
              key={m.number}
              onClick={() => handleMonthClick(m.number)}
              className={`font-semibold ${activeMonth === m.number ? 'text-black' : ''}`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* list transaksi */}
        <ul className="space-y-3">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => {
              const isTopUp = item.transaction_type === 'TOPUP';
              const colorClass = isTopUp ? 'text-green-500' : 'text-red-500';
              const amountSign = isTopUp ? '+' : '-';

              const formattedDate = new Date(item.created_on).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              });

              const formattedTime = new Date(item.created_on).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });

              return (
                <li
                  key={index}
                  className="border border-gray-200 rounded-lg px-4 py-3 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className={`font-semibold ${colorClass}`}>
                      {amountSign}Rp{item.total_amount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formattedDate} - {formattedTime} WIB
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 text-right">
                    {item.description}
                  </div>
                </li>
              );
            })
          ) : (
            // kalo belum ada transaksi
            <p className="text-sm text-gray-400 mt-6 text-center">
              Maaf tidak ada histori transaksi bulan ini
            </p>
          )}
        </ul>

        {/* tombol buat load lebih banyak transaksi */}
        {history.length >= limit && (
          <div className="mt-6 text-center">
            <button
              onClick={handleShowMore}
              className="text-red-500 font-semibold hover:underline"
            >
              Show more
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryTransaction;