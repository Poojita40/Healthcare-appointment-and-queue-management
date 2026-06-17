import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, description, colorClass = 'sc-icon-badge-blue', accent = '#3b5bfc' }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="sc-feature-card group h-full flex flex-col justify-between"
      id={`feature-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="space-y-4">
        {/* Icon badge */}
        <div
          className={`sc-icon-badge ${colorClass} w-12 h-12 rounded-2xl group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="font-display font-extrabold text-[15px] text-slate-900 leading-snug">
            {title}
          </h3>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <div
        className="mt-5 h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-400"
        style={{ background: accent }}
      />
    </motion.div>
  );
}
