import React from 'react';
import Navbar from '../components/Navbar';

import { Heart, Baby, Sparkles, Brain, ShieldAlert, BadgePlus, LayoutGrid, CheckCircle } from 'lucide-react';
import { SPECIALTIES } from '../utils/constants';

export default function Services() {
  const serviceList = [
    { name: "General Practice", desc: "First response care, general diagnoses, prescriptions, and regular body wellness reporting.", icon: LayoutGrid },
    { name: "Cardiology Unit", desc: "Full heart healthcare, ECGS, dynamic scanning, blood tension checking, and heart rate management.", icon: Heart },
    { name: "Pediatrics Division", desc: "Infant and adolescent care, growth timelines monitoring, vaccinations, and physical wellbeings.", icon: Baby },
    { name: "Neurology", desc: "Complex nervous systems treatments, cranial checkups, migraines support, and reflexes analysis.", icon: Brain },
    { name: "Dermatology", desc: "Cosmetic skin therapies, rashes and allergies diagnostics, tissue care, and protection tips.", icon: Sparkles },
    { name: "Emergency Response", desc: "Around-the-clock priority token systems, emergency ambulances, and immediate care.", icon: ShieldAlert }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between" id="sc-services-page">
      <Navbar />
      
      <main className="flex-1 py-16 bg-gray-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-wider">
              WHAT WE DO EVERYDAY
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-950 tracking-tight leading-tight">
              Premium Medical Services Tailored For Comfort
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed font-sans">
              SmartCare integrates multiple clinical specialties. View our active divisions available for digital scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceList.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="bg-white p-6 border border-gray-100/80 rounded-2xl shadow-xs hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-lg text-gray-950 leading-tight">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full filter blur-3xl opacity-10" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              <div className="space-y-4">
                <span className="text-xs font-mono text-teal-400 uppercase tracking-widest font-bold">Smart scheduling</span>
                <h3 className="font-display font-bold text-2xl sm:text-3.5xl text-white tracking-tight leading-none">
                  Need a priority queue slot?
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Register free today and book a consultation with some of India's pre-eminent clinicians with instant live queue token allocations.
                </p>
              </div>

              <div className="space-y-3.5 max-w-sm">
                <div className="flex gap-2.5 text-slate-300 text-xs">
                  <CheckCircle className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                  <span>Interactive Patient Console</span>
                </div>
                <div className="flex gap-2.5 text-slate-300 text-xs">
                  <CheckCircle className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                  <span>Real-Time Consultation Updates</span>
                </div>
                <div className="flex gap-2.5 text-slate-300 text-xs">
                  <CheckCircle className="w-4.5 h-4.5 text-teal-400 shrink-0" />
                  <span>Free Cancellations and Rescheduling</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>


    </div>
  );
}
