import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

import logo from '../assets/Logo.png';
import ilustrasi from '../assets/IllustrasiLogin.png';
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const initialValues = { email: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email tidak valid')
      .required('Email wajib diisi'),
    password: Yup.string()
      .min(8, 'Minimal 8 karakter')
      .required('Password wajib diisi'),
  });

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await api.post('/login', values);

      const token = response.data.data.token;
      const user = response.data.data;

      localStorage.setItem('token', token);

      dispatch(setCredentials({ token, user }));

      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setLoginError(true);
      setFieldError('password', 'Email atau password salah');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={logo} alt="SIMS PPOB" className="w-6 h-6" />
            <span className="text-lg font-semibold text-gray-900">
              SIMS PPOB
            </span>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Masuk atau buat akun untuk memulai
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <Form className="space-y-4 text-left">
                {/* email */}
                <div className="relative">
                  <EnvelopeIcon
                    className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors
                    ${
                      formik.touched.email && formik.errors.email
                        ? 'text-red-500'
                        : formik.values.email
                        ? 'text-black'
                        : 'text-gray-400'
                    }`}
                  />
                  <Field
                    name="email"
                    type="email"
                    placeholder="masukan email anda"
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none transition-colors
                    ${
                      formik.touched.email && formik.errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : formik.values.email
                        ? 'border-black focus:ring-black'
                        : 'border-gray-300 focus:ring-gray-300'
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* kata sandi disini */}
                <div className="relative">
                  <LockClosedIcon
                    className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors
                    ${
                      formik.touched.password && formik.errors.password
                        ? 'text-red-500'
                        : formik.values.password
                        ? 'text-black'
                        : 'text-gray-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>

                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="masukan password anda"
                    className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none transition-colors
                    ${
                      formik.touched.password && formik.errors.password
                        ? 'border-red-500 focus:ring-red-500'
                        : formik.values.password
                        ? 'border-black focus:ring-black'
                        : 'border-gray-300 focus:ring-gray-300'
                    }`}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Masuk
                </button>

                {/* Kalo error */}
                {loginError && (
                  <div className="mt-4 flex justify-between items-center bg-red-100 text-red-600 text-sm px-4 py-3 rounded-md relative border border-red-200">
                    <span>password yang anda masukan salah</span>
                    <button
                      onClick={() => setLoginError(false)}
                      className="absolute right-2 top-2 hover:text-red-800"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </Form>
            )}
          </Formik>

          <p className="mt-4 text-sm text-center">
            Belum punya akun?{' '}
            <a href="/register" className="text-black">
              register <span className="text-red-600 font-semibold hover:underline">disini</span>
            </a>
          </p>
        </div>
      </div>

      <div className="w-1/2 bg-[#fff1f0] flex items-center justify-center">
        <img src={ilustrasi} alt="illustration" className="max-w-sm" />
      </div>
    </div>
  );
};

export default Login;
