import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import QueueStatusCard from '../components/QueueStatusCard';
import Loader from '../components/Loader';
import { queueService } from '../services/queueService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { Timer, ArrowUpRight, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QueueTracking() {
  const { user } = useAuth();
  const [queues, setQueues] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const qData = await queueService.getQueueStatus();
      setQueues(qData);

      if (user) {
        const appts = await appointmentService.getAppointments({ patientId: user.id });
        setAppointments(appts);
      }
    } catch (err) {
      toast.error('Failed to sync real-time queue listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // 10s poll
    return () => clearInterval(interval);
  }, [user]);

  // Find active appointment
  const currentActive = appointments.find((a) => a.status === 'PENDING' || a.status === 'CONFIRMED');

  return (
    <div className="flex h-screen bg-slate-100 font-sans" id="sc-tracking-root">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar title="Real-Time Token Monitor" />

        <main className="p-6 flex-1 max-w-4xl w-full mx-auto space-y-6">

          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 rounded-3xl shadow-md">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-normal">Smart Live Queue Operations</h3>
              <p className="text-[11px] text-white/80 leading-normal font-sans">
                Below are active doctor consult rooms. Tokens update dynamically as clinicians call next patients.
              </p>
            </div>
          </div>

          {loading ? (
            <Loader size="medium" text="Syncing live servers..." />
          ) : (
            <div className="space-y-6">
              {queues.map((q) => (
                <QueueStatusCard
                  key={q.doctorId}
                  queue={q}
                  yourTokenNumber={
                    currentActive && currentActive.doctorId === q.doctorId
                      ? currentActive.tokenNumber
                      : null
                  }
                  onRefresh={loadData}
                />
              ))}

              {queues.length === 0 && (
                <p className="text-center text-xs text-gray-400 italic">No doctors are active currently in general consulting.</p>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
