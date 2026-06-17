import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin, Shield, HelpCircle, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800" id="sc-main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-sky-500 text-white p-1.5 rounded-lg">
                <Activity className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-lg text-white">SmartCare</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Skip the queue. SmartCare is a next-generation healthcare platform supporting digital queue token assignment, real-time wait estimation, and instant bookings.
            </p>
            <div className="flex gap-4">
              {/* Simple aesthetic circles */}
              <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-sky-500/10 hover:text-sky-400 flex items-center justify-center cursor-pointer text-xs">t</div>
              <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-sky-500/10 hover:text-sky-400 flex items-center justify-center cursor-pointer text-xs">f</div>
              <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-sky-500/10 hover:text-sky-400 flex items-center justify-center cursor-pointer text-xs">in</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-white font-semibold mb-4 text-sm tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-sky-400 transition-colors">Home Landing</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition-colors">Medical Services</Link></li>
              <li><Link to="/about" className="hover:text-sky-400 transition-colors">Our Doctors & About</Link></li>
              <li><Link to="/contact" className="hover:text-sky-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Specialties / Services */}
          <div>
            <h3 className="font-display text-white font-semibold mb-4 text-sm tracking-wider uppercase">Doctors Specialties</h3>
            <ul className="space-y-2.5 text-sm col-span-2">
              <li><Link to="/services" className="hover:text-sky-400 transition-colors pointer-events-none">Cardiology (Heart Health)</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition-colors pointer-events-none">Pediatrics (Child Care)</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition-colors pointer-events-none">Dermatology (Skin Care)</Link></li>
              <li><Link to="/services" className="hover:text-sky-400 transition-colors pointer-events-none">Neurology (Brain & Nervous)</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-display text-white font-semibold mb-4 text-sm tracking-wider uppercase">Get In Touch</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-sky-400 shrink-0" />
                <span>Sector 15, Hospital Road, ND 110022</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-sky-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-sky-400 shrink-0" />
                <span>support@smartcare.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} SmartCare Queue Systems. All rights reserved. Registered under Medical Solutions.
          </div>
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-sky-500" /> Privacy Policy</span>
            <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-sky-500" /> Terms of Service</span>
            <span className="flex items-center gap-1 text-slate-400">Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Health</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
