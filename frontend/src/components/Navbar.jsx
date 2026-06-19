import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Menu, X, LogIn, UserPlus, Grid, LogOut, Stethoscope, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);               // Mobile drawer
  const [showLoginDropdown, setShowLoginDropdown] = useState(false); // Desktop dropdown
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);    // Mobile login sub-menu
  const dropdownRef = useRef(null);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin-dashboard';
    if (user.role === 'DOCTOR') return '/doctor-dashboard';
    return '/patient-dashboard';
  };

  const navLinks = [
    { label: 'Features', path: '/#features-section' },
    { label: 'Departments', path: '/#departments-section' },
    { label: 'Doctors', path: '/#doctors-section' },
    { label: 'How It Works', path: '/#how-it-works-section' },
    { label: 'FAQs', path: '/#faqs-section' },
  ];

  const loginOptions = [
    { label: 'Patient Login', path: '/login?role=PATIENT', icon: User, color: 'text-sky-600' },
    { label: 'Clinical Staff Login', path: '/login?role=DOCTOR', icon: Stethoscope, color: 'text-emerald-600' },
    { label: 'Admin Login', path: '/login?role=ADMIN', icon: ShieldCheck, color: 'text-purple-600' },
  ];

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#')) {
      if (location.pathname === '/') {
        e.preventDefault();
        const id = path.split('#')[1];
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/', { replace: true });
  };

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowLoginDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileLoginOpen(false);
  }, [location.pathname, location.search]);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs" id="sc-main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex md:flex-1 justify-start">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-gray-900">
                Smart<span className="text-blue-600">Care</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav links */}
          <div className="hidden md:flex md:flex-1 justify-center items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors py-1 cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth buttons */}
          <div className="hidden md:flex md:flex-1 justify-end items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(getDashboardPath())}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all px-4 py-2 rounded-xl border border-blue-100/50"
                  id="sc-navbar-dash-desktop"
                >
                  <Grid className="h-4 w-4" />
                  Dashboard
                </button>
                <div className="h-4 w-px bg-gray-200" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-red-500 transition-colors px-3 py-2 rounded-xl"
                  id="sc-navbar-logout-desktop"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Login dropdown */}
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setShowLoginDropdown((v) => !v)}
                    onMouseEnter={() => setShowLoginDropdown(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                    id="sc-navbar-login-desktop"
                    aria-haspopup="true"
                    aria-expanded={showLoginDropdown}
                  >
                    <LogIn className="h-4 w-4" />
                    Login ▾
                  </button>

                  <AnimatePresence>
                    {showLoginDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        onMouseLeave={() => setShowLoginDropdown(false)}
                        className="absolute right-0 top-full pt-2 w-52 z-50"
                      >
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-1.5">
                          {loginOptions.map((opt) => {
                            const Icon = opt.icon;
                            return (
                              <Link
                                key={opt.path}
                                to={opt.path}
                                onClick={() => setShowLoginDropdown(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              >
                                <Icon className={`w-4 h-4 ${opt.color}`} />
                                {opt.label}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/register"
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-all shadow-sm"
                  id="sc-navbar-register-desktop"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="flex items-center justify-center md:hidden text-gray-500 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 focus:outline-none min-w-[40px] min-h-[40px]"
            id="sc-mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            id="sc-mobile-sidebar"
          >
            <div className="px-4 pt-2 pb-5 space-y-1">

              {/* Nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => { setIsOpen(false); navigate(getDashboardPath()); }}
                      className="flex items-center gap-2 w-full px-3 py-3 rounded-xl text-sm font-bold text-blue-700 bg-blue-50 border border-blue-100"
                      id="sc-navbar-dash-mobile"
                    >
                      <Grid className="h-5 w-5" />
                      Go to Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-100"
                      id="sc-navbar-logout-mobile"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout {user?.name ? `(${user.name})` : ''}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Login section with sub-options */}
                    <div>
                      <button
                        onClick={() => setMobileLoginOpen((v) => !v)}
                        className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 active:bg-blue-700 transition-colors"
                        id="sc-navbar-login-mobile"
                        aria-expanded={mobileLoginOpen}
                      >
                        <span className="flex items-center gap-2">
                          <LogIn className="h-5 w-5" />
                          Login
                        </span>
                        <span className="text-lg leading-none">{mobileLoginOpen ? '▲' : '▼'}</span>
                      </button>

                      {/* Mobile login sub-options */}
                      <AnimatePresence>
                        {mobileLoginOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1 ml-2 space-y-1 border-l-2 border-blue-100 pl-3">
                              {loginOptions.map((opt) => {
                                const Icon = opt.icon;
                                return (
                                  <Link
                                    key={opt.path}
                                    to={opt.path}
                                    onClick={() => { setIsOpen(false); setMobileLoginOpen(false); }}
                                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                    id={`sc-mobile-login-${opt.label.replace(/\s+/g, '-').toLowerCase()}`}
                                  >
                                    <Icon className={`w-4 h-4 ${opt.color}`} />
                                    {opt.label}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 transition-colors"
                      id="sc-navbar-register-mobile"
                    >
                      <UserPlus className="h-5 w-5" />
                      Register as Patient
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
