import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogIn, ArrowLeft, Sparkles, ArrowRight, Stethoscope, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { INITIAL_DOCTORS } from '../utils/constants';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const showExpired = searchParams.get('expired') === 'true';
  const roleParam = searchParams.get('role'); // 'PATIENT', 'DOCTOR', 'ADMIN'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const savedUserStr = localStorage.getItem('sc_user');
      if (savedUserStr) {
        try {
          const u = JSON.parse(savedUserStr);
          if (u.role === 'ADMIN') navigate('/admin-dashboard', { replace: true });
          else if (u.role === 'DOCTOR') navigate('/doctor-dashboard', { replace: true });
          else navigate('/patient-dashboard', { replace: true });
        } catch {
          navigate('/', { replace: true });
        }
      }
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (showExpired) toast.error('Session expired. Please reauthenticate.');
  }, [showExpired]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      toast.success(`Welcome back, ${loggedUser.name}!`);
      if (loggedUser.role === 'ADMIN') navigate('/admin-dashboard', { replace: true });
      else if (loggedUser.role === 'DOCTOR') navigate('/doctor-dashboard', { replace: true });
      else navigate(redirect === 'book-appointment' ? '/book-appointment' : '/patient-dashboard', { replace: true });
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'Invalid email or password. Please try again.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Quick credential fill (only shown on ADMIN and DOCTOR pages)
  const autofillCredentials = (role, subType = '') => {
    if (role === 'DOCTOR') {
      if (subType === 'PRIYA') {
        setEmail('priya.patel@smartcare.com');
        setPassword('password123');
        toast.success('Dr. Priya Patel credentials loaded!');
      } else {
        setEmail('arvind.sharma@smartcare.com');
        setPassword('password123');
        toast.success('Dr. Arvind Sharma credentials loaded!');
      }
    } else if (role === 'ADMIN') {
      setEmail('admin@smartcare.com');
      setPassword('password123');
      toast.success('Admin credentials loaded!');
    }
  };

  // Role label for heading
  const roleMeta = {
    PATIENT: { label: 'Patient Portal', icon: User, color: 'bg-sky-500', accent: 'sky' },
    DOCTOR: { label: 'Clinical Staff Portal', icon: Stethoscope, color: 'bg-emerald-500', accent: 'emerald' },
    ADMIN: { label: 'Admin Terminal', icon: ShieldCheck, color: 'bg-purple-500', accent: 'purple' },
  };
  const meta = roleMeta[roleParam] || roleMeta['PATIENT'];
  const RoleIcon = meta.icon;

  // Only show developer accounts to ADMIN and DOCTOR portals — never to PATIENT
  const showDevAccounts = roleParam === 'ADMIN' || roleParam === 'DOCTOR';

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col md:flex-row relative" id="sc-login-root">

      {/* ─── Left Column (desktop only) ─── */}
      <div className="hidden md:flex md:w-1/2 min-h-screen relative overflow-hidden select-none">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
          alt="SmartCare Clinical Lobby"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/35 to-transparent" />
        <div className="absolute top-6 left-6 z-20">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-sky-600 transition-all bg-white/90 backdrop-blur-md hover:bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        <div className="absolute bottom-16 left-12 right-12 space-y-4 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-[11px] font-bold text-gray-700 rounded-full border border-gray-200/50 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            Empowering Patients
          </div>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-gray-900 tracking-tight leading-tight">
            Your Health,<br />Simplified.
          </h1>
          <p className="text-xs lg:text-sm text-gray-600 max-w-md font-medium leading-relaxed">
            Join thousands of patients who have transformed their healthcare experience with our intelligent queue management and instant scheduling system.
          </p>
        </div>
      </div>

      {/* ─── Right Column: Login Form ─── */}
      <div className="w-full md:w-1/2 min-h-screen flex items-start md:items-center justify-center p-6 pt-16 md:p-12 lg:p-16 bg-slate-50/60 border-l border-gray-100/55 overflow-y-auto">

        {/* Mobile: Back to Home */}
        <div className="absolute top-5 left-5 md:hidden z-20">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-sky-600 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl shadow-xs border border-gray-150 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
        </div>

        {/* Mobile: Role selector tabs (shown only when no role param OR when on mobile) */}
        {!roleParam && (
          <div className="absolute top-5 right-5 md:hidden z-20">
            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-xs border border-gray-100">
              <Link to="/login?role=PATIENT" className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-sky-500 text-white">Patient</Link>
              <Link to="/login?role=DOCTOR" className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">Staff</Link>
              <Link to="/login?role=ADMIN" className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">Admin</Link>
            </div>
          </div>
        )}

        <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl border border-gray-200/40 shadow-xl space-y-6 mt-4 md:mt-0">

          {/* Header */}
          <div className="text-center space-y-2">
            <div className={`mx-auto ${meta.color} text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md`}>
              <RoleIcon className="h-6 w-6" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-gray-950 tracking-tight leading-none pt-1">
              {meta.label}
            </h2>
            <p className="text-xs text-gray-400">
              {roleParam === 'ADMIN' && 'Admin terminal — system management and analytics.'}
              {roleParam === 'DOCTOR' && 'Clinical staff portal — manage consultations and queues.'}
              {(!roleParam || roleParam === 'PATIENT') && 'Sign in to access your medical dashboards and records.'}
            </p>
          </div>

          {/* Portal switcher (desktop) */}
          {!roleParam && (
            <div className="hidden md:flex gap-2 p-1 bg-slate-50 border border-slate-100 rounded-xl">
              <Link to="/login?role=PATIENT" className="flex-1 text-center text-[11px] font-bold py-2 rounded-lg bg-sky-500 text-white shadow-sm">
                Patient
              </Link>
              <Link to="/login?role=DOCTOR" className="flex-1 text-center text-[11px] font-bold py-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-xs transition-all">
                Clinical Staff
              </Link>
              <Link to="/login?role=ADMIN" className="flex-1 text-center text-[11px] font-bold py-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-xs transition-all">
                Admin
              </Link>
            </div>
          )}

          {roleParam && (
            <div className="flex gap-2 p-1 bg-slate-50 border border-slate-100 rounded-xl">
              <Link
                to="/login?role=PATIENT"
                className={`flex-1 text-center text-[11px] font-bold py-2 rounded-lg transition-all ${roleParam === 'PATIENT' ? 'bg-sky-500 text-white shadow-sm' : 'text-gray-500 hover:bg-white hover:shadow-xs'}`}
              >
                Patient
              </Link>
              <Link
                to="/login?role=DOCTOR"
                className={`flex-1 text-center text-[11px] font-bold py-2 rounded-lg transition-all ${roleParam === 'DOCTOR' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500 hover:bg-white hover:shadow-xs'}`}
              >
                Clinical Staff
              </Link>
              <Link
                to="/login?role=ADMIN"
                className={`flex-1 text-center text-[11px] font-bold py-2 rounded-lg transition-all ${roleParam === 'ADMIN' ? 'bg-purple-500 text-white shadow-sm' : 'text-gray-500 hover:bg-white hover:shadow-xs'}`}
              >
                Admin
              </Link>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block select-none">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-medium text-gray-800 bg-transparent border-none outline-none p-0 mt-1"
                id="login-email-input"
                autoComplete="username"
                placeholder={
                  roleParam === 'ADMIN' ? 'admin@smartcare.com' :
                  roleParam === 'DOCTOR' ? 'doctor@smartcare.com' :
                  'patient@example.com'
                }
              />
            </div>

            <div className="space-y-1 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
              <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block select-none">
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs font-semibold text-gray-800 bg-transparent border-none outline-none p-0 mt-1"
                id="login-password-input"
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-semibold text-gray-500">
              <div className="flex items-center gap-1.5 select-none">
                <input type="checkbox" id="keep-log" className="rounded-sm border-gray-300 text-sky-500" />
                <label htmlFor="keep-log" className="cursor-pointer">Stay Signed In</label>
              </div>
              <button
                type="button"
                onClick={() => toast.info('To reset your password, please contact the SmartCare administrator.')}
                className="hover:text-sky-600 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 active:scale-[0.98] text-white py-3.5 rounded-xl font-semibold font-display text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-sky-100 cursor-pointer disabled:opacity-50"
              id="sc-login-action"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* ── Developer Evaluation Accounts (ADMIN & DOCTOR only, never PATIENT) ── */}
          {showDevAccounts && (
            <div className="border-t border-gray-100 pt-5 space-y-3">
              <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest text-center flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                Developer Evaluation Accounts
              </p>

              {roleParam === 'DOCTOR' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INITIAL_DOCTORS.map((doc, idx) => {
                    const colors = [
                      'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100',
                      'bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-100',
                      'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border-cyan-100',
                      'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100',
                      'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100',
                      'bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-100',
                    ];
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          setEmail(doc.email);
                          setPassword('password123');
                          toast.success(`${doc.name} credentials loaded!`);
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
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => autofillCredentials('ADMIN')}
                    className="w-full text-[10px] font-bold py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg active:scale-95 transition-all text-center border border-purple-100 cursor-pointer"
                  >
                    🔐 Admin Access — admin@smartcare.com
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Register link (only on Patient portal) ── */}
          {(!roleParam || roleParam === 'PATIENT') && (
            <div className="text-center text-xs text-gray-500 font-medium pt-1">
              First time using SmartCare?{' '}
              <Link
                to="/register"
                className="text-sky-600 hover:underline font-semibold flex items-center justify-center gap-1 mt-1 font-display"
              >
                Create a patient profile
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* ── Back to portal selector if already on a specific role ── */}
          {roleParam && (
            <div className="text-center text-[10px] text-gray-400 pt-1">
              Not {roleParam.toLowerCase()} staff?{' '}
              <Link to="/login" className="text-sky-600 font-bold hover:underline">
                Switch portal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
