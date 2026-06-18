import React from 'react';
import { Calendar, Award, Clock, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { getDoctorPhoto } from '../utils/doctorPhotoMapper';

export default function DoctorCard({ doctor, onBookClick }) {
  const { id, name, specialization, qualification, experience, availability } = doctor;
  const imageUrl = getDoctorPhoto(name);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="sc-card flex flex-col h-full"
      id={`doctor-card-${id}`}
    >
      {/* Image area */}
      <div className="relative h-52 overflow-hidden rounded-t-[19px] bg-slate-100">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => { e.target.onerror = null; e.target.src = imageUrl; }}
        />
        <div className="sc-doctor-img-overlay" />

        {/* Specialization badge top-left */}
        <div className="absolute top-3 left-3 sc-glass-dark px-3 py-1.5 rounded-xl">
          <span className="text-[10px] font-extrabold text-white uppercase tracking-wider font-mono">
            {specialization}
          </span>
        </div>

        {/* Star rating top-right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 sc-glass px-2.5 py-1 rounded-xl">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-bold text-slate-800">4.9</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-display font-extrabold text-[15px] text-slate-900 leading-snug">
              {name}
            </h4>
            <p className="text-[11px] font-bold tracking-widest text-blue-600 uppercase mt-0.5 font-mono">
              {qualification}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="sc-icon-badge sc-icon-badge-amber w-7 h-7 rounded-lg">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-slate-500">
                Experience: <strong className="text-slate-800">{experience}</strong>
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="sc-icon-badge sc-icon-badge-green w-7 h-7 rounded-lg mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-slate-500 leading-relaxed">
                <strong className="text-slate-800 font-display">{availability}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onBookClick(doctor)}
          className="sc-btn sc-btn-primary w-full mt-1 text-[12px]"
        >
          Schedule Consultation
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
