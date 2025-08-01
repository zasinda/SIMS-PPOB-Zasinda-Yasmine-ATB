import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Payment = () => {
  // state buat nyimpen semua layanan, layanan yang dipilih, dan pesan hasil transaksi
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');

  // ambil data layanan waktu halaman pertama kali kebuka
  useEffect(() => {
    const fetchServices = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await api.get('/services', { headers });
        setServices(response.data.services); // simpen data layanan ke state
      } catch (err) {
        console.error(err); // kalo gagal tampilkan error di console
      }
    };
    fetchServices();
  }, []);

  // handle proses pembayaran
  const handlePayment = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      // kirim data transaksi ke backend
      const response = await api.post('/transaction', { service_code: selected }, { headers });
      setMessage(`transaksi berhasil. invoice: ${response.data.invoice_number}`);
    } catch (err) {
      // kalp gagal ambil pesan dari server atau fallback ke default
      setMessage(err.response?.data?.message || 'transaksi gagal');
    }
  };

  return (
    <div>
      <h2>Pembayaran</h2>

      {/* dropdown buat pilih layanan */}
      <select onChange={(e) => setSelected(e.target.value)}>
        <option value="">pilih layanan</option>
        {services.map((s) => (
          <option key={s.service_code} value={s.service_code}>
            {s.service_name}
          </option>
        ))}
      </select>

      {/* tombol bayar */}
      <button disabled={!selected} onClick={handlePayment}>
        bayar
      </button>

      {/* tampilin pesan kalo ada */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Payment;