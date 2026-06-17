import React from 'react';
import Navbar from '../components/Navbar';

import DoctorCard from '../components/DoctorCard';
import { INITIAL_DOCTORS } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, User } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const handleBookDoctor = (doc) => {
    navigate(`/book-appointment?doctorId=${doc.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" id="sc-about-page">
      <Navbar />

      <main className="flex-1 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          
          {/* Top Info block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-sm uppercase tracking-wider">
                Our Mission
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4.5xl text-gray-950 tracking-tight leading-tight">
                Pioneering Healthcare Scheduling & Live Queue Management Systems
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed font-sans">
                At SmartCare, we believe waiting rooms shouldn't be stressful, overcrowded places. By introducing automated SC-coded queues, live doctor status checks, and interactive timing estimation algorithms, we put control back in the hands of the patient.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-gray-600 font-bold">100% Secure Encryption (JWT)</span>
                </div>
                <div className="flex gap-2">
                  <Heart className="w-5 h-5 text-rose-500 shrink-0" />
                  <span className="text-xs text-gray-600 font-bold">Patient Comfort-First UI</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-slate-50 aspect-video relative shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600"
                alt="Clinic Lounge"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Roster Section */}
          <div className="space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <h2 className="font-display font-extrabold text-3xl text-gray-950 tracking-tight">
                Meet Clinical Board Specialists
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                A highly selected team of doctors with years of academic, research, and healthcare service achievements.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_DOCTORS.map((doc) => (
                <DoctorCard
                  key={doc.id}
                  doctor={doc}
                  onBookClick={handleBookDoctor}
                />
              ))}
            </div>
          </div>

        </div>
      </main>


    </div>
  );
}
