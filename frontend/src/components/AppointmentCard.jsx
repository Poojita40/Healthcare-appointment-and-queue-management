import React from 'react';
import { Calendar, Clock, Ticket, AlertCircle, CheckCircle2, XCircle, Ban, PlayCircle } from 'lucide-react';
import { formatToken, formatDate, formatTime12 } from '../utils/helpers';
import { APPOINTMENT_STATUS } from '../utils/constants';

const STATUS_CONFIG = {
  [APPOINTMENT_STATUS.COMPLETED]: {
    label: 'Completed',
    icon: CheckCircle2,
    badgeClass: 'sc-badge sc-badge-green',
    barColor: '#10b981',
  },
  [APPOINTMENT_STATUS.CANCELLED]: {
    label: 'Cancelled',
    icon: XCircle,
    badgeClass: 'sc-badge sc-badge-red',
    barColor: '#ef4444',
  },
  [APPOINTMENT_STATUS.SKIPPED]: {
    label: 'Skipped',
    icon: Ban,
    badgeClass: 'sc-badge sc-badge-amber',
    barColor: '#f59e0b',
  },
  [APPOINTMENT_STATUS.CONFIRMED]: {
    label: 'Live Consult',
    icon: PlayCircle,
    badgeClass: 'sc-badge sc-badge-live',
    barColor: '#3b5bfc',
  },
};

const DEFAULT_STATUS = {
  label: 'Queued',
  icon: AlertCircle,
  badgeClass: 'sc-badge sc-badge-sky',
  barColor: '#0ea5e9',
};

export default function AppointmentCard({ appointment, index, onAction, actionLabel, cancelable, onCancel }) {
  const { id, doctorName, doctorSpecialization, appointmentDate, appointmentTime, tokenNumber, status, notes } = appointment;

  const cfg = STATUS_CONFIG[status] || DEFAULT_STATUS;
  const StatusIcon = cfg.icon;

  return (
    <div className="sc-appt-card" id={`appointment-card-${id}`}>
      {/* Left accent bar */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1"
        style={{ background: cfg.barColor, borderRadius: '18px 0 0 18px' }}
      />

      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-5 pl-3">

        {/* ── Left: Doctor + Date info ── */}
        <div className="space-y-3 flex-1">
          {/* Status badge */}
          <span className={cfg.badgeClass}>
            <StatusIcon className="w-3.5 h-3.5" />
            {cfg.label}
          </span>

          {/* Doctor name */}
          <div>
            <h4 className="font-display font-extrabold text-[15px] text-slate-900 leading-snug mt-2">
              {doctorName || 'Senior General Physician'}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mt-0.5">
              {doctorSpecialization || 'General Practitioner'}
            </p>
          </div>

          {/* Date + Time row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1.5">
              <div className="sc-icon-badge sc-icon-badge-blue w-6 h-6 rounded-lg">
                <Calendar className="w-3 h-3" />
              </div>
              <span className="text-xs text-slate-600 font-semibold font-mono">
                {formatDate(appointmentDate)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="sc-icon-badge sc-icon-badge-purple w-6 h-6 rounded-lg">
                <Clock className="w-3 h-3" />
              </div>
              <span className="text-xs text-slate-600 font-semibold font-mono">
                {formatTime12(appointmentTime)}
              </span>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-700 uppercase font-mono text-[9px] tracking-widest block mb-1">
                Chief Complaints:
              </span>
              {notes}
            </div>
          )}
        </div>

        {/* ── Right: Token + Buttons ── */}
        <div className="flex flex-col items-end justify-between gap-3 min-w-[130px]">
          {/* Token */}
          <div className="sc-token-display w-full sm:w-auto">
            <p className="sc-token-label">Token</p>
            <p className="sc-token-number mt-0.5">{formatToken(tokenNumber)}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full justify-end flex-wrap">
            {cancelable && status === APPOINTMENT_STATUS.PENDING && (
              <button
                onClick={() => onCancel && onCancel(id)}
                className="sc-btn sc-btn-danger text-[11px] py-2 px-3"
              >
                Cancel
              </button>
            )}
            {onAction && (
              <button
                onClick={() => onAction(id)}
                className="sc-btn sc-btn-primary text-[11px] py-2 px-4"
              >
                {actionLabel || 'Details'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
