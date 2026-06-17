import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Menu, X, LogIn, UserPlus, Grid, LogOut, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
    { label: 'FAQs', path: '/#faqs-section' }
  ];

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#')) {
      if (location.pathname === '/') {
        e.preventDefault();
        const id = path.split('#')[1];
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 shadow-xs" id="sc-main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-gray-900">
                Smart<span className="text-blue-600">Care</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="text-xs font-bold text-gray-600 hover:text-blue-600 transition-colors py-1 cursor-pointer font-sans"
              >
                {link.label}
              </Link>
            ))}

            {/* Authentication & CTA buttons */}
            <div className="flex items-center space-x-3 ml-2">
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
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-650 hover:text-red-500 transition-colors px-3 py-2 rounded-xl"
                    id="sc-navbar-logout-desktop"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 relative">
                  {/* Custom login trigger selection with chevron dropdown */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setShowLoginDropdown(true)}
                    onMouseLeave={() => setShowLoginDropdown(false)}
                  >
                    <button
                      onClick={() => navigate('/login')}
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      id="sc-navbar-login-desktop"
                    >
                      <span>Login</span>
                      <span className="text-[10px]">▼</span>
                    </button>

                    {/* Dropdown container */}
                    {showLoginDropdown && (
                      <div className="absolute right-0 top-full pt-1.5 w-44 z-50">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1">
                          <Link 
                            to="/login?role=PATIENT"
                            className="block px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            Patient Access
                          </Link>
                          <Link 
                            to="/login?role=DOCTOR"
                            className="block px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            Clinician Access
                          </Link>
                          <Link 
                            to="/login?role=ADMIN"
                            className="block px-4 py-2 text-left text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            Admin Terminal
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/register"
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-all shadow-sm"
                    id="sc-navbar-register-desktop"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 focus:outline-hidden"
              id="sc-mobile-menu-btn"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
            id="sc-mobile-sidebar"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => {
                    setIsOpen(false);
                    handleNavClick(e, link.path);
                  }}
                  className="block px-3 py-2.5 rounded-xl text-sm font-bold text-gray-650 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-100 space-y-2">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate(getDashboardPath());
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-base font-medium text-blue-700 bg-blue-50"
                      id="sc-navbar-dash-mobile"
                    >
                      <Grid className="h-5 w-5" />
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-base font-medium text-red-650 hover:bg-red-50"
                      id="sc-navbar-logout-mobile"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout ({user?.name})
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50"
                      id="sc-navbar-login-mobile"
                    >
                      <LogIn className="h-5 w-5" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-base font-medium text-white bg-blue-600 justify-center text-center shadow-xs"
                      id="sc-navbar-register-mobile"
                    >
                      <UserPlus className="h-5 w-5" />
                      Register Now
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
