import React, { useState, useEffect } from 'react';
import { Timer, Users, RefreshCw, Layers, ShieldAlert, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { formatToken, estimateWaitTime } from '../utils/helpers';
import { motion } from 'motion/react';
import { queueService } from '../services/queueService';

export default function QueueTrackingCard({
  queue,
  yourTokenNumber = null,
  doctorId = null,
  doctorName = null,
  status = 'PENDING',
  onRefresh,
  compact = false
}) {
  const [liveQueue, setLiveQueue] = useState(queue || null);
  const [loading, setLoading] = useState(!queue && (doctorId || doctorName));
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync state with props when queue is updated externally
  useEffect(() => {
    if (queue) {
      setLiveQueue(queue);
    }
  }, [queue]);

  const loadQueueData = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const queueList = await queueService.getQueueStatus();
      let matched = null;
      
      if (doctorId) {
        matched = queueList.find(q => q.doctorId === parseInt(doctorId, 10));
      } else if (doctorName) {
        const queryName = String(doctorName).toLowerCase();
        matched = queueList.find(q => {
          const docName = String(q.doctorName).toLowerCase();
          return docName.includes(queryName) || queryName.includes(docName);
        });
      }

      // If no exact match and queue is passed but not found, or neither, fallback
      if (!matched && queueList.length > 0) {
        if (liveQueue?.doctorId) {
          matched = queueList.find(q => q.doctorId === liveQueue.doctorId);
        } else {
          matched = queueList[0]; // default fallback
        }
      }

      if (matched) {
        setLiveQueue(matched);
      }
    } catch (err) {
      console.error('Error fetching live queue for tracking card:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Poll for real-time queue position updates
  useEffect(() => {
    if (!queue && (doctorId || doctorName)) {
      loadQueueData(true);
      const timer = setInterval(() => {
        loadQueueData(true);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [queue, doctorId, doctorName]);

  const handleManualRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    loadQueueData();
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center flex flex-col items-center justify-center min-h-[140px] space-y-2">
        <RefreshCw className="w-6 h-6 text-sky-500 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Synchronizing live queue position...</p>
      </div>
    );
  }

  // Extract variables
  const currentToken = liveQueue ? parseInt(liveQueue.currentToken, 10) : 0;
  const nextToken = liveQueue ? parseInt(liveQueue.nextToken, 10) : currentToken + 1;
  const resolvedDocName = liveQueue?.doctorName || doctorName || 'Healthcare Provider';

  const patientTokenVal = yourTokenNumber ? parseInt(yourTokenNumber, 10) : null;
  
  // Compute queue relative metrics
  let patientsAhead = 0;
  let isMyTurn = false;
  let isCompletedOrPast = false;

  if (patientTokenVal) {
    if (patientTokenVal > currentToken) {
      patientsAhead = patientTokenVal - currentToken - 1;
    } else if (patientTokenVal === currentToken) {
      isMyTurn = true;
    } else {
      isCompletedOrPast = true;
    }
  }

  // Override behavior based on appointment status context
  const isCancelled = status?.toUpperCase() === 'CANCELLED';
  const isCompletedStatus = status?.toUpperCase() === 'COMPLETED';
  const isRescheduled = status?.toUpperCase() === 'RESCHEDULED';

  // Determine token badge visual theme
  let statusBadgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';
  let statusText = 'No Active Ticket';

  if (patientTokenVal) {
    if (isCancelled) {
      statusBadgeStyle = 'bg-rose-50 border border-rose-100 text-rose-600';
      statusText = 'Cancelled & Released';
    } else if (isCompletedStatus) {
      statusBadgeStyle = 'bg-emerald-50 border border-emerald-100 text-emerald-600';
      statusText = 'Completed Consult';
    } else if (isMyTurn) {
      statusBadgeStyle = 'bg-amber-100 border border-amber-300 text-amber-800 animate-pulse';
      statusText = 'YOUR TURN NOW!';
    } else if (isCompletedOrPast) {
      statusBadgeStyle = 'bg-slate-100 border border-slate-200 text-slate-500';
      statusText = 'Completed / Passed';
    } else if (isRescheduled) {
      statusBadgeStyle = 'bg-sky-50 border border-sky-100 text-sky-700';
      statusText = 'Rescheduled (Waiting)';
    } else {
      statusBadgeStyle = 'bg-sky-50 border border-sky-100 text-sky-700';
      statusText = 'Active in Queue';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs relative ${
        compact ? 'p-4 space-y-3.5' : 'p-5 lg:p-6 space-y-5'
      }`}
    >
      {/* Real-time Indicator Bar */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-bold text-sky-600 tracking-wider flex items-center gap-1.5 leading-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Queue Tracking Board
          </p>
          <p className={`font-display font-extrabold text-slate-900 truncate mt-1 leading-tight ${compact ? 'text-xs' : 'text-sm'}`}>
            {resolvedDocName}
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          className="text-slate-400 hover:text-sky-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors pointer-events-auto shrink-0 cursor-pointer"
          disabled={isRefreshing}
          title="Refresh real-time status"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-500' : ''}`} />
        </button>
      </div>

      {/* Main Stats Block */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-12 items-center'}`}>
        
        {/* Token presentation */}
        <div className={`${compact ? 'w-full' : 'sm:col-span-4'} bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center space-y-1`}>
          <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">YOUR QUEUE TICKET</span>
          <div className="font-mono text-3xl font-extrabold text-slate-900 tracking-tight">
            {patientTokenVal ? formatToken(patientTokenVal) : 'SC--'}
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${statusBadgeStyle}`}>
            {statusText}
          </span>
        </div>

        {/* Live Status Summary Panel */}
        <div className={`${compact ? 'w-full space-y-3' : 'sm:col-span-8 grid grid-cols-2 gap-4'}`}>
          
          {/* Patients Ahead */}
          <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Patients Ahead</p>
              <p className="text-base font-extrabold text-slate-800 mt-1 leading-none font-sans">
                {isCancelled ? 'N/A' : isCompletedStatus || isCompletedOrPast ? '0' : patientsAhead}
              </p>
              <p className="text-[9px] text-slate-400 truncate mt-0.5">In waiting room</p>
            </div>
          </div>

          {/* Wait estimation */}
          <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2.5 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Estimated Wait</p>
              <p className="text-base font-extrabold text-emerald-700 mt-1 leading-none font-sans">
                {isCancelled ? (
                  'Cancelled'
                ) : isCompletedStatus || isCompletedOrPast ? (
                  'Completed'
                ) : isMyTurn ? (
                  <span className="text-amber-700 font-bold">Now Consult!</span>
                ) : (
                  estimateWaitTime(patientsAhead)
                )}
              </p>
              <p className="text-[9px] text-slate-400 truncate mt-0.5">Average 15m / consult</p>
            </div>
          </div>

        </div>

      </div>

      {/* Live Serving Progress Bar / Interactive Board Info (only rendered if not cancelled) */}
      {!isCancelled && !isCompletedStatus && !isCompletedOrPast && (
        <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-2.5 border border-slate-800">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-sky-400" /> Currently Serving:
            </span>
            <span className="font-mono text-white font-black text-sm bg-white/10 px-2 py-0.5 rounded-md border border-white/5">
              {formatToken(currentToken)}
            </span>
          </div>

          {patientTokenVal && (
            <div className="relative pt-1">
              <div className="flex mb-1 items-center justify-between text-[10px] text-slate-400">
                <span>Queue Entry</span>
                <span>Active Consult</span>
              </div>
              <div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-slate-800">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      currentToken && patientTokenVal
                        ? Math.max(5, (currentToken / patientTokenVal) * 100)
                        : 0
                    )}%`,
                  }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-700 ${
                    isMyTurn ? 'bg-amber-500 animate-pulse' : 'bg-sky-500'
                  }`}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1">
                <span>Cabin 1</span>
                <span>Your Token: {formatToken(patientTokenVal)}</span>
              </div>
            </div>
          )}

          {isMyTurn && (
            <div className="bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[10.5px] p-2.5 rounded-lg flex items-start gap-2 animate-pulse mt-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="font-medium leading-normal">
                <strong>Attention Patient:</strong> The practitioner is now ready for your consultation. Please proceed immediately to cabin or clinical examination area.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Cancelled context tip */}
      {isCancelled && (
        <div className="bg-slate-50 border border-slate-100 text-slate-500 text-[10.5px] p-3 rounded-xl flex gap-2">
          <span className="text-sm select-none">ℹ️</span>
          <p className="leading-snug">
            This token booking has been released. The clinic has automatically returned your slot position back to the master pool to reduce clinician idle-time.
          </p>
        </div>
      )}
    </motion.div>
  );
}
