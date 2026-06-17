import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

import { Activity, UserPlus, ArrowLeft, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: 'Male',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field audits
    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error('All asterisked (*) fields are required.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        age: form.age ? parseInt(form.age, 10) : null,
        gender: form.gender,
        address: form.address,
        role: 'PATIENT' // Force patient role for public registrations
      });

      toast.success('Registration completed! You can now log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Registration failed. Email might already be taken.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" id="sc-register-root">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-sky-50/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-xl w-full relative z-10 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="mx-auto bg-sky-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shadow-sky-100">
              <UserPlus className="h-6 w-6" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-gray-950 tracking-tight leading-none">
              Register Patient Profile
            </h2>
            <p className="text-xs text-gray-400">
              Complete your profile info to obtain digital tokens immediately.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full text-xs font-medium text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1"
                />
              </div>

              <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full text-xs font-medium text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full text-xs font-medium text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1"
                />
              </div>

              <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full text-xs font-medium text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full text-xs font-medium text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1"
                  min="1"
                  max="125"
                />
              </div>

              <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Location / Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full text-xs font-medium text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Password *</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full text-xs font-semibold text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1"
                />
              </div>

              <div className="space-y-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full text-xs font-semibold text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 active:scale-98 text-white py-3.5 rounded-xl font-semibold font-display text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-sky-100 cursor-pointer disabled:opacity-50"
              id="sc-submit-register"
            >
              <UserPlus className="w-4.5 h-4.5" />
              {loading ? 'Creating Patient Account...' : 'Initialize My Account'}
            </button>
          </form>

          <div className="text-center text-xs text-gray-500 font-medium pt-2 border-t border-gray-100">
            Already registered?{' '}
            <Link to="/login" className="text-sky-600 hover:underline font-semibold flex items-center justify-center gap-1 mt-1">
              <ArrowLeft className="w-3 h-3" />
              Sign in to your account
            </Link>
          </div>

        </div>
      </main>


    </div>
  );
}
