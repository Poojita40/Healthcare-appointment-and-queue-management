import React from 'react';
import { Bell, Heart, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const TYPE_CONFIG = {
  SUCCESS: {
    icon: CheckCircle2,
    badgeClass: 'sc-icon-badge sc-icon-badge-green',
    barColor: '#10b981',
  },
  ERROR: {
    icon: AlertCircle,
    badgeClass: 'sc-icon-badge sc-icon-badge-rose',
    barColor: '#ef4444',
  },
  INFO: {
    icon: Info,
    badgeClass: 'sc-icon-badge sc-icon-badge-sky',
    barColor: '#0ea5e9',
  },
  DEFAULT: {
    icon: Bell,
    badgeClass: 'sc-icon-badge sc-icon-badge-blue',
    barColor: '#3b5bfc',
  },
};

export default function NotificationCard({ notification }) {
  const { id, title, message, type, createdAt } = notification;
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.DEFAULT;
  const IconComp = cfg.icon;

  return (
    <div
      className="sc-notif-card flex items-start gap-3.5 relative overflow-hidden"
      id={`notification-${id}`}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0, bottom: 0, left: 0,
          width: 3,
          background: cfg.barColor,
          borderRadius: '14px 0 0 14px',
        }}
      />

      {/* Icon badge */}
      <div className={`${cfg.badgeClass} w-9 h-9 rounded-xl ml-2 shrink-0`}>
        <IconComp className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <h5 className="text-sm font-bold text-slate-900 font-display truncate leading-snug">
          {title}
        </h5>
        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
          {message}
        </p>
        <span className="text-[10px] font-mono text-slate-400 block mt-1.5 uppercase tracking-wide">
          {formatDate(createdAt || new Date())}
        </span>
      </div>
    </div>
  );
}
