import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, UserCheck, Timer, ShieldAlert, Sparkles, ArrowRight, UserCheck2, Stethoscope, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBookClick = () => {
    if (isAuthenticated) {
      navigate('/book-appointment');
    } else {
      navigate('/login?redirect=book-appointment');
    }
  };

  const scrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-white py-12 lg:py-20" id="sc-hero-container">
      {/* Soft background ambient glows */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-sky-50/50 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text & Stats */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EEF2FF] border border-blue-100 text-[#3B82F6] text-[11px] font-bold rounded-full tracking-wide uppercase font-display"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Redefining Hospital Queues
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-none"
              >
                SmartCare
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="font-display text-2xl sm:text-3.5xl lg:text-4xl font-bold text-blue-600 tracking-tight leading-tight"
              >
                Smarter Healthcare. Shorter Wait Times.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed font-sans font-medium"
              >
                Book appointments instantly. Track queue positions in real time. Receive automated notifications. Manage health parameters efficiently.
              </motion.p>
            </div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-row items-center gap-4 pt-2"
            >
              <button
                onClick={() => {
                  const el = document.getElementById('features-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-1.5 text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all px-6 py-3 rounded-xl text-xs font-bold font-display shadow-md shadow-blue-200"
                id="sc-hero-get-started"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleBookClick}
                className="flex items-center justify-center gap-2 text-gray-700 hover:text-blue-600 hover:border-blue-500 bg-white active:scale-98 transition-all px-6 py-3 rounded-xl text-xs font-bold font-display border border-gray-200 shadow-xs"
                id="sc-hero-book-now"
              >
                Book Appointment
              </button>
            </motion.div>

            {/* Stats block integrated directly into Hero left column */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-100 max-w-2xl"
              id="sc-hero-stats"
            >
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-display">98%</p>
                <p className="text-[11px] text-gray-400 font-bold leading-snug">Wait reduction rate</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-display">10k+</p>
                <p className="text-[11px] text-gray-400 font-bold leading-snug">Outpatients served</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-display">15m</p>
                <p className="text-[11px] text-gray-400 font-bold leading-snug">Average checkout speed</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Premium High-Fidelity Medical Graphic Block */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative w-full max-w-md"
            >
              {/* Soft Blue shadow background */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-300 to-sky-300 rounded-[32px] blur-xl opacity-35" />

              {/* White mock dashboard card */}
              <div className="relative bg-white p-8 rounded-[28px] border border-gray-100 shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
                {/* SVG Medical Device network illustration */}
                <svg viewBox="0 0 400 240" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <g opacity="0.1">
                    <line x1="20" y1="40" x2="380" y2="40" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="20" y1="120" x2="380" y2="120" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="20" y1="200" x2="380" y2="200" stroke="#3B82F6" strokeWidth="1" strokeDasharray="3 3" />
                  </g>

                  {/* Connective Nodes Waves */}
                  <path d="M40,120 Q90,70 140,130 T240,110 T340,140" stroke="url(#blue_grad_light)" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
                  
                  {/* Dynamic Glowing ECG Pulse Line in the Center */}
                  <motion.path
                    d="M10,120 L80,120 L95,85 L110,155 L125,120 L150,120 L165,100 L175,135 L190,120 L210,120 L225,50 L240,180 L255,120 L280,120 L295,95 L310,145 L325,120 L390,120"
                    stroke="url(#pulse_grad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  />

                  {/* Central medical heart */}
                  <motion.g
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    transform="translate(200, 120)"
                  >
                    {/* Glowing blue accent in background */}
                    <circle cx="0" cy="0" r="30" fill="#3B82F6" opacity="0.1" />
                    <circle cx="0" cy="0" r="22" fill="#3B82F6" opacity="0.2" />
                    {/* Heart shape */}
                    <path
                      d="M12,5 C12,5 7,0 2,0 C-3,0 -8,4 -8,9.5 C-8,15.5 -1,21 12,28 C25,21 32,15.5 32,9.5 C32,4 27,0 22,0 C17,0 12,5 12,5 Z"
                      fill="url(#heart_grad)"
                      transform="translate(-12, -14)"
                    />
                    {/* Tiny cross inside heart */}
                    <path d="M-2, -2 H2 M0, -4 V0" stroke="#white" strokeWidth="1.5" strokeLinecap="round" />
                  </motion.g>

                  {/* Graphic Nodes: Circular visual symbols */}

                  {/* Node 1: Running Figure (Top Right) */}
                  <g transform="translate(260, 60)">
                    <circle cx="0" cy="0" r="16" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1.5" />
                    <path d="M-4,0 L0,-4 L4,0 M-2,4 L0,-4 L2,4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="0" cy="-6" r="2.5" fill="#3B82F6" />
                  </g>

                  {/* Node 2: Shield Icon (Top Left) */}
                  <g transform="translate(140, 65)">
                    <circle cx="0" cy="0" r="16" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1.5" />
                    <path d="M-6,-6 H6 V0 C6,4 0,8 0,8 C0,8 -6,4 -6,0 V-6 Z" fill="#2563EB" opacity="0.2" />
                    <path d="M-6,-6 H6 V0 C6,4 0,8 0,8 C0,8 -6,4 -6,0 V-6 Z" stroke="#2563EB" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M-3,0 L-1,2 L4,-3" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
                  </g>

                  {/* Node 3: Medical Cross List (Bottom Mid-Left) */}
                  <g transform="translate(130, 160)">
                    <circle cx="0" cy="0" r="16" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1.5" />
                    <rect x="-6" y="-8" width="12" height="15" rx="2" stroke="#3B82F6" strokeWidth="1.2" />
                    <line x1="-3" y1="-4" x2="3" y2="-4" stroke="#10B981" strokeWidth="1.5" />
                    <line x1="-3" y1="0" x2="2" y2="0" stroke="#3B82F6" strokeWidth="1.5" />
                    <line x1="-3" y1="4" x2="1" y2="4" stroke="#3B82F6" strokeWidth="1.2" />
                  </g>

                  {/* Node 4: Thermometer (Bottom Right) */}
                  <g transform="translate(255, 160)">
                    <rect x="-24" y="-12" width="48" height="24" rx="12" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1" />
                    <circle cx="-12" cy="0" r="5" fill="#10B981" />
                    <path d="M-12,-1 V1" stroke="white" strokeWidth="1.5" />
                    <text x="-2" y="4" fill="#065F46" fontSize="10" fontWeight="bold" fontFamily="monospace">36.6°C</text>
                  </g>

                  {/* Connecting lines from heart */}
                  <line x1="200" y1="120" x2="255" y2="76" stroke="#93C5FD" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="200" y1="120" x2="145" y2="81" stroke="#93C5FD" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="170" y1="135" x2="140" y2="147" stroke="#93C5FD" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="230" y1="135" x2="250" y2="145" stroke="#93C5FD" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Gradients declaration */}
                  <defs>
                    <linearGradient id="heart_grad" x1="0" y1="0" x2="24" y2="28" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                    <linearGradient id="blue_grad_light" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#93C5FD" />
                      <stop offset="100%" stopColor="#60A5FA" />
                    </linearGradient>
                    <linearGradient id="pulse_grad" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Floating capsule overlay at bottom left */}
                <div className="absolute bottom-4 left-4 bg-[#111827] text-white px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-slate-800 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[9.5px] font-bold uppercase tracking-wider font-mono">
                    SMARTCARE HEALTH NETWORK
                  </span>
                  <div className="h-2.5 w-px bg-slate-700" />
                  <span className="text-[9.5px] font-bold text-gray-400">
                    Verified Medical Partners
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
