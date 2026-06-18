import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

import { Activity, LogIn, KeyRound, ShieldAlert, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_DOCTORS } from '../utils/constants';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const showExpired = searchParams.get('expired') === 'true';
  const roleParam = searchParams.get('role');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      // Decode user role from local storage to redirect correctly
      const savedUserStr = localStorage.getItem('sc_user');
      if (savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          if (user.role === 'ADMIN') navigate('/admin-dashboard');
          else if (user.role === 'DOCTOR') navigate('/doctor-dashboard');
          else navigate('/patient-dashboard');
        } catch (e) {
          navigate('/');
        }
      }
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (showExpired) {
      toast.error('Session expired. Please reauthenticate.');
    }
  }, [showExpired]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please input your email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      toast.success(`Welcome back, ${loggedUser.name}!`);
      
      // Determine dashboard redirect
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (loggedUser.role === 'DOCTOR') {
        navigate('/doctor-dashboard');
      } else {
        if (redirect === 'book-appointment') {
          navigate('/book-appointment');
        } else {
          navigate('/patient-dashboard');
        }
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || 'Invalid email or password combination.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Quick Account Login Helper (for testing evaluation)
  const autofillCredentials = (role, subType = '') => {
    if (role === 'DOCTOR') {
      if (subType === 'PRIYA') {
        setEmail('priya.patel@smartcare.com');
        setPassword('password123');
        toast.success('Dr. Priya Patel credentials loaded. Click Login!');
      } else {
        setEmail('arvind.sharma@smartcare.com');
        setPassword('password123');
        toast.success('Dr. Arvind Sharma credentials loaded. Click Login!');
      }
    } else if (role === 'ADMIN') {
      setEmail('admin@smartcare.com');
      setPassword('password123');
      toast.success('System Admin credentials loaded. Click Login!');
    } else if (role === 'PATIENT') {
      setEmail('rohan.kumar@example.com');
      setPassword('password123');
      toast.success('Patient credentials loaded. Click Login!');
    }
  };



  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col md:flex-row relative" id="sc-login-root">
      
      {/* Left Column: Full height half page clinical environment image split */}
      <div className="hidden md:flex md:w-1/2 min-h-screen relative overflow-hidden select-none">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200" 
          alt="SmartCare Clinical Lobby" 
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Ambient fade visual overlay with clear contrast transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-50/20" />
        
        {/* Floating Back to Home Top Left of the Left Column */}
        <div className="absolute top-6 left-6 z-20">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-sky-600 transition-all bg-white/90 backdrop-blur-md hover:bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-250/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Text Overlay exactly matching the requested layout */}
        <div className="absolute bottom-16 left-12 right-12 space-y-4 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white hover:bg-slate-50 transition-all text-[11px] font-bold text-gray-700 rounded-full border border-gray-200/50 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            Empowering Patients
          </div>
          
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-gray-900 tracking-tight leading-tight">
            Your Health,<br />Simplified.
          </h1>
          
          <p className="text-xs lg:text-sm text-gray-650 max-w-md font-medium leading-relaxed">
            Join thousands of patients who have transformed their healthcare experience with our intelligent queue management and instant scheduling system.
          </p>
        </div>
      </div>

      {/* Right Column: Centered Login Form panel on subtle clean gray backdrop */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-16 bg-slate-50/60 border-l border-gray-100/55 relative overflow-y-auto">
        
        {/* Floating Back to Home for mobile viewports only */}
        <div className="absolute top-6 left-6 block md:hidden z-20">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-sky-600 transition-all bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl shadow-xs border border-gray-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>

        {/* Centered card for credentials submission */}
        <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-gray-200/40 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="mx-auto bg-sky-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shadow-sky-100">
              <Activity className="h-6 w-6" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-gray-950 tracking-tight leading-none pt-1">
              Sign In to SmartCare
            </h2>
            <p className="text-xs text-gray-450">
              Access your medical dashboards, tokens and records.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block select-none">EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-medium text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1"
                id="login-email-input"
                autoComplete="off"
              />
            </div>

            <div className="space-y-1 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block select-none">PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs font-semibold text-gray-800 bg-transparent border-none focus:outline-hidden p-0 mt-1"
                id="login-password-input"
                autoComplete="new-password"
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500">
              <div className="flex items-center gap-1.5 select-none">
                <input type="checkbox" id="keep-log" className="rounded-sm border-gray-300 text-sky-500 pr-1" />
                <label htmlFor="keep-log" className="cursor-pointer">Stay Signed In</label>
              </div>
              <button
                type="button"
                onClick={() => toast.info('To reset password, use standard register or contact technical administrators.')}
                className="hover:text-sky-600 transition-colors"
              >
                Forgot terms and passwords?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 active:scale-98 text-white py-3.5 rounded-xl font-semibold font-display text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-sky-100 cursor-pointer disabled:opacity-50"
              id="sc-login-action"
            >
              <LogIn className="w-4.5 h-4.5" />
              {loading ? 'Authenticating Credentials...' : 'Sign In To Console'}
            </button>
          </form>

          {/* Quick Demo Accounts login blocks */}
          <div className="border-t border-gray-150 pt-5 space-y-3">
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
              Developer evaluation accounts
            </p>
            {roleParam === 'DOCTOR' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INITIAL_DOCTORS.map((doc, idx) => {
                  const colors = [
                    'bg-emerald-50 text-emerald-750 hover:bg-emerald-100/80 border-emerald-100/50',
                    'bg-teal-50 text-teal-750 hover:bg-teal-100/80 border-teal-100/50',
                    'bg-cyan-50 text-cyan-750 hover:bg-cyan-100/80 border-cyan-100/50',
                    'bg-blue-50 text-blue-750 hover:bg-blue-100/80 border-blue-100/50',
                    'bg-indigo-50 text-indigo-750 hover:bg-indigo-100/80 border-indigo-100/50',
                    'bg-violet-50 text-violet-750 hover:bg-violet-100/80 border-violet-100/50'
                  ];
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        setEmail(doc.email);
                        setPassword('password123');
                        toast.success(`${doc.name} credentials loaded. Click Login!`);
                      }}
                      className={`text-[10px] font-bold py-2 rounded-lg active:scale-95 transition-all text-center border cursor-pointer ${colors[idx % colors.length]}`}
                    >
                      {doc.name}
                    </button>
                  );
                })}
              </div>
            )}

            {roleParam === 'ADMIN' && (
              <div className="flex justify-center w-full">
                <button
                  type="button"
                  onClick={() => autofillCredentials('ADMIN')}
                  className="w-full sm:w-2/3 text-[10px] font-bold py-2.5 bg-purple-50 text-purple-750 hover:bg-purple-100/80 rounded-lg active:scale-95 transition-all text-center border border-purple-100/50 cursor-pointer"
                >
                  Admin Access
                </button>
              </div>
            )}

            {(!roleParam || !['DOCTOR', 'PATIENT', 'ADMIN'].includes(roleParam)) && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => autofillCredentials('PATIENT')}
                  className="text-[10px] font-bold py-2 bg-blue-50 text-blue-750 hover:bg-blue-100/80 rounded-lg active:scale-95 transition-all text-center border border-blue-100/50 cursor-pointer"
                >
                  Patient Login
                </button>
                <button
                  type="button"
                  onClick={() => autofillCredentials('ADMIN')}
                  className="text-[10px] font-bold py-2 bg-purple-50 text-purple-750 hover:bg-purple-100/80 rounded-lg active:scale-95 transition-all text-center border border-purple-100/50 cursor-pointer"
                >
                  Admin Access
                </button>
                <button
                  type="button"
                  onClick={() => autofillCredentials('DOCTOR', 'ARVIND')}
                  className="text-[10px] font-bold py-2 bg-emerald-50 text-emerald-750 hover:bg-emerald-100/80 rounded-lg active:scale-95 transition-all text-center border border-emerald-100/50 cursor-pointer"
                >
                  Dr. Arvind (M)
                </button>
                <button
                  type="button"
                  onClick={() => autofillCredentials('DOCTOR', 'PRIYA')}
                  className="text-[10px] font-bold py-2 bg-teal-50 text-teal-750 hover:bg-teal-100/80 rounded-lg active:scale-95 transition-all text-center border border-teal-100/50 cursor-pointer"
                >
                  Dr. Priya (F)
                </button>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-gray-500 font-medium pt-2">
            First time using SmartCare?{' '}
            <Link to="/register" className="text-sky-600 hover:underline font-semibold flex items-center justify-center gap-1 mt-1 font-display">
              Create an online patient profile
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
