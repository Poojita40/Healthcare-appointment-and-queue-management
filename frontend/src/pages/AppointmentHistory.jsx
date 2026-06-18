import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AppointmentCard from '../components/AppointmentCard';
import Loader from '../components/Loader';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { History, Calendar, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AppointmentHistory({ onMenuClick }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const data = await appointmentService.getAppointments({ patientId: user.id });
      setAppointments(data);
    } catch (err) {
      toast.error('Failed to sync appointment list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar title="Consultation History Log" onMenuClick={onMenuClick} />

        <main className="p-6 flex-1 max-w-5xl w-full mx-auto space-y-6">

          <div className="flex justify-between items-center pb-2">
            <div>
              <h3 className="font-display font-extrabold text-lg text-slate-900 leading-snug">
                Your Appointment Records
              </h3>
              <p className="text-xs text-gray-450 mt-0.5">
                Full retrospective log showing completed, pending, as well as cancelled consultation sequences.
              </p>
            </div>

            <button
              onClick={() => {
                setLoading(true);
                fetchAppointments();
              }}
              className="text-xs font-bold text-gray-500 hover:text-sky-600 flex items-center gap-1.5 hover:bg-white p-2 rounded-xl border border-transparent hover:border-gray-100 transition-all cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Sync Lists
            </button>
          </div>

          {loading ? (
            <Loader size="medium" text="Syncing historic records..." />
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  cancelable={false}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-150 py-16 space-y-4 shadow-xs">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100">
                <History className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h4 className="font-display font-bold text-md text-gray-900">No Records Found</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You have no historical transactions recorded. Every consultation token you create will be automatically logged here.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
