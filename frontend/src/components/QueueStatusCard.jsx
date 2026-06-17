import React from 'react';
import { Timer, Users, RefreshCw, Layers, Activity } from 'lucide-react';
import { formatToken, estimateWaitTime } from '../utils/helpers';
import { motion } from 'framer-motion';

export default function QueueStatusCard({ queue, yourTokenNumber = null, onRefresh }) {
  if (!queue) return null;

  const { currentToken, nextToken, estimatedWaitTime: waitTime, doctorName } = queue;

  const patientTokenVal  = yourTokenNumber ? parseInt(yourTokenNumber, 10) : null;
  const currentTokenVal  = currentToken ? parseInt(currentToken, 10) : 0;
  const patientsAhead    = patientTokenVal && patientTokenVal > currentTokenVal
    ? patientTokenVal - currentTokenVal - 1
    : 0;

  const isYourTurn = patientTokenVal && patientTokenVal === currentTokenVal;
  const isDone     = patientTokenVal && patientTokenVal < currentTokenVal;

  return (
    <div className="sc-queue-card" id="sc-live-queue-card">

      {/* Header */}
      <div className="flex justify-between items-start mb-5 pb-4 sc-divider-light">
        <div>
          <span className="sc-badge sc-badge-live">
            <span className="sc-dot-live" />
            Live Queue Monitor
          </span>
          <h4 className="text-white font-display font-semibold text-base mt-2 leading-snug">
            {doctorName || 'General Practice Area'}
          </h4>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:rotate-180 duration-300"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Token grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">

        {/* Currently serving */}
        <div className="flex items-center gap-4">
          <div
            style={{
              background: 'rgba(59,91,252,0.12)',
              border: '1.5px solid rgba(59,91,252,0.28)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              minWidth: '72px',
              textAlign: 'center',
            }}
          >
            <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase font-mono mb-1">Now</p>
            <p className="font-mono text-2xl font-black text-white tracking-tight leading-none">
              {formatToken(currentToken)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Currently Consulting</p>
            <p className="text-white font-display font-bold text-base">Now Serving</p>
            <p className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400 font-semibold">
              <span className="sc-dot-live" style={{ width: 6, height: 6 }} />
              Real-time active
            </p>
          </div>
        </div>

        {/* Stats mini-card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            padding: '1rem',
          }}
        >
          <div className="flex justify-between items-center text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Next token:
            </span>
            <strong className="font-mono text-white text-sm">
              {formatToken(nextToken || currentToken + 1)}
            </strong>
          </div>
          <div
            className="flex justify-between items-center text-xs text-slate-400 pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-sky-400" />
              Per consultation:
            </span>
            <strong className="text-white">~15 min</strong>
          </div>
        </div>
      </div>

      {/* Patient personal row */}
      {patientTokenVal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-5 flex flex-col sm:flex-row justify-between gap-4 items-center"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Your token */}
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: isYourTurn ? 'rgba(16,185,129,0.20)' : 'rgba(59,91,252,0.15)',
                border: `1.5px solid ${isYourTurn ? 'rgba(16,185,129,0.35)' : 'rgba(59,91,252,0.30)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isYourTurn ? '#10b981' : '#6b7dfc',
                fontWeight: 800, fontSize: 14,
                flexShrink: 0,
              }}
            >
              {isDone ? '✓' : isYourTurn ? '!' : patientsAhead + 1}
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Your Token</p>
              <p className="text-white font-mono font-bold text-sm">
                {formatToken(patientTokenVal)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 text-center sm:text-left">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-center sm:justify-start">
                <Users className="w-3 h-3 text-emerald-400" /> Ahead
              </p>
              <p className="text-white font-bold text-lg leading-none mt-1">
                {isDone ? '—' : patientsAhead}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 justify-center sm:justify-start">
                <Timer className="w-3 h-3 text-sky-400" /> Wait
              </p>
              <p className="text-sky-400 font-bold text-sm leading-none mt-1">
                {isDone ? 'Done' : isYourTurn ? 'Your Turn!' : estimateWaitTime(patientsAhead)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
