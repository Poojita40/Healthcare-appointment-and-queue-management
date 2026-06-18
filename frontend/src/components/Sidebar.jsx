import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  CalendarPlus, 
  History, 
  Timer, 
  User, 
  Users, 
  Stethoscope, 
  BarChart3, 
  LogOut,
  Activity
} from 'lucide-react';

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const patientLinks = [
    { label: 'Overview', path: '/patient-dashboard', icon: Home },
    { label: 'Book Consult', path: '/book-appointment', icon: CalendarPlus },
    { label: 'History log', path: '/appointment-history', icon: History },
    { label: 'Track Queue', path: '/queue-tracking', icon: Timer },
    { label: 'My profile', path: '/profile', icon: User }
  ];

  const doctorLinks = [
    { label: 'Consult Center', path: '/doctor-dashboard', icon: Stethoscope },
    { label: 'My Profile', path: '/profile', icon: User }
  ];

  const adminLinks = [
    { label: 'Analytics Panel', path: '/admin-dashboard', icon: BarChart3 },
    { label: 'My profile', path: '/profile', icon: User }
  ];

  const getLinks = () => {
    if (user.role === 'ADMIN') return adminLinks;
    if (user.role === 'DOCTOR') return doctorLinks;
    return patientLinks;
  };

  return (
    <aside className="w-64 bg-slate-950 text-slate-400 border-r border-slate-800 min-h-screen flex flex-col justify-between shrink-0" id="sc-dashboard-sidebar">
      <div className="p-6">
        {/* Sidebar Brand header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-sky-500 text-white p-2 rounded-xl">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <span className="font-display font-semibold text-lg text-white">SmartCare</span>
          <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-400/25 px-1.5 py-0.5 rounded-sm font-bold font-mono tracking-tight shrink-0">
            {user.role}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {getLinks().map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.label}
                to={link.path}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-sky-500 text-white font-semibold shadow-md shadow-sky-600/10' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                  }
                `}
                onClick={() => {
                  if (onClose) onClose();
                }}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar bottom Profile Card */}
      <div className="p-6 border-t border-slate-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-850 flex items-center justify-center font-bold font-display text-white border border-slate-800 shrink-0 select-none">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="min-w-0">
            <h6 className="text-sm font-bold text-slate-100 font-display truncate leading-snug">
              {user.name}
            </h6>
            <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        {/* Exit portal button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white active:scale-98 transition-all rounded-xl border border-rose-500/10 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out Session
        </button>
      </div>
    </aside>
  );
}
