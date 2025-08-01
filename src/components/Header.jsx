import React from 'react';
import { NavLink, Link  } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => (
  <header className="flex items-center justify-between px-8 py-4 border-b bg-white">
    <div className="flex items-center space-x-2">
      <img src={logo} alt="logo" className="w-6 h-6" />
       <Link to="/dashboard" className="text-lg font-bold">
        SIMS PPOB
      </Link>    </div>
    <nav className="flex space-x-6">
      <NavLink
        to="/topup"
        className={({ isActive }) =>
          isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
        }
      >
        Top Up
      </NavLink>
      <NavLink
        to="/history"
        className={({ isActive }) =>
          isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
        }
      >
        Transaction
      </NavLink>
      <NavLink
        to="/akun"
        className={({ isActive }) =>
          isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
        }
      >
        Akun
      </NavLink>
    </nav>
  </header>
);

export default Header;