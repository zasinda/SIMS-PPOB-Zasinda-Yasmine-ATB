import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TopUp from './pages/TopUp';
import Payment from './pages/Payment';
import HistoryTransaction from './pages/HistoryTransaction';
import EditProfile from './pages/EditProfile';
import Account from './pages/Account'
import Logout from './pages/Logout';
import LayananDetail from './pages/LayananDetail';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/layanan/:code" element={<LayananDetail />} />
        <Route path="/topup" element={<TopUp />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/history" element={<HistoryTransaction />} />
        <Route path="/akun" element={<Account />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
