import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api';
import { Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
import ilustrasi from '../assets/IllustrasiLogin.png';
import logo from '../assets/logo.png';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const initialValues = {
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Email tidak valid').required('Email wajib diisi'),
    first_name: Yup.string().required('Nama depan wajib diisi'),
    last_name: Yup.string().required('Nama belakang wajib diisi'),
    password: Yup.string().min(8, 'Minimal 8 karakter').required('Password wajib diisi'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password tidak sama')
      .required('Konfirmasi password wajib diisi'),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await api.post('/registration', values);
      alert('Registrasi berhasil!');
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex flex-col justify-center px-12">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
             <img src={logo} alt="SIMS PPOB" className="w-6 h-6" />
                       <span className="text-lg font-semibold text-gray-900">SIMS PPOB</span>
          </div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Lengkapi data untuk membuat akun</h2>

          {/* Fini formik form */}
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {() => (
              <Form className="space-y-4">
                {/* disini email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Field
                    name="email"
                    type="email"
                    placeholder="masukkan email anda"
                    className="w-full border rounded px-10 py-2 focus:outline-none focus:border-black"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>

                {/* nama depan */}
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Field
                    name="first_name"
                    placeholder="nama depan"
                    className="w-full border rounded px-10 py-2 focus:outline-none focus:border-black"
                  />
                  <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm" />
                </div>

                {/* nama belakang */}
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Field
                    name="last_name"
                    placeholder="nama belakang"
                    className="w-full border rounded px-10 py-2 focus:outline-none focus:border-black"
                  />
                  <ErrorMessage name="last_name" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="buat password"
                    className="w-full border rounded px-10 py-2 focus:outline-none focus:border-black"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>

                {/* konfirmasi pw */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <Field
                    name="confirm_password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="konfirmasi password"
                    className="w-full border rounded px-10 py-2 focus:outline-none focus:border-black"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3.5 text-gray-500">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <ErrorMessage name="confirm_password" component="div" className="text-red-500 text-sm" />
                </div>

                {/* button regis */}
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
                  Registrasi
                </button>
              </Form>
            )}
          </Formik>

          {/* hal login */}
          <p className="mt-4 text-sm text-center text-gray-600">
            Sudah punya akun?{' '}
            <a href="/" className="text-red-600 font-semibold hover:underline">
              login di sini
            </a>
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center bg-[#fff1f0]">
              <img src={ilustrasi} alt="illustration" className="max-w-sm" />
      </div>
    </div>
  );
};

export default Register;
