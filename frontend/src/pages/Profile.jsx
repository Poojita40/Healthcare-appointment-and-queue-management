import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import { User, Contact, Phone, Landmark, Save, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile({ onMenuClick }) {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age ? String(user.age) : '',
    gender: user?.gender || 'Male',
    address: user?.address || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error('Name & Phone are required fields.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        age: form.age ? parseInt(form.age, 10) : null,
        gender: form.gender,
        address: form.address
      });
      toast.success('Your profile has been updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile. Please verify your fields.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]" id="sc-profile-root">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar title="Profile Settings" onMenuClick={onMenuClick} />

        <main className="p-6 flex-1 max-w-3xl w-full mx-auto space-y-6">

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
            <h3 className="font-display font-extrabold text-lg text-slate-900 border-b border-gray-50 pb-3 block select-none">
              Manage Your Personal File
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase block select-none">FULL NAME</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rahul Sen"
                      className="w-full text-xs font-semibold text-gray-800 bg-transparent border-none focus:outline-hidden p-0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase block select-none">EMAIL (REGISTERED)</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Contact className="w-4.5 h-4.5 text-gray-300" />
                    <input
                      type="email"
                      disabled
                      value={form.email}
                      className="w-full text-xs font-semibold text-gray-400 bg-transparent border-none focus:outline-hidden p-0 cursor-not-allowed"
                      title="Registration emails cannot be changed once integrated."
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase block select-none">PHONE NUMBER</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 9988776655"
                      className="w-full text-xs font-semibold text-gray-800 bg-transparent border-none focus:outline-hidden p-0"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase block select-none">GENDER</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full text-xs font-semibold text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1 cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase block select-none">AGE</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    placeholder="e.g. 34"
                    className="w-full text-xs font-semibold text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1"
                    min="1"
                    max="125"
                  />
                </div>

                <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase block select-none">ADDRESS / LOCATION</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Landmark className="w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="e.g. Saket, New Delhi"
                      className="w-full text-xs font-semibold text-gray-800 bg-transparent border-none focus:outline-hidden p-0"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 active:scale-98 text-white px-6 py-3 rounded-xl text-xs font-bold font-display cursor-pointer disabled:opacity-50 transition-all shadow-sm"
                  id="sc-save-profile-btn"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Preserving updates...' : 'Save Profile Changes'}
                </button>
              </div>

            </form>
          </div>

        </main>
      </div>
    </div>
  );
}
