import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { queueService } from '../services/queueService';
import { appointmentService } from '../services/appointmentService';
import { doctorService } from '../services/doctorService';
import { formatToken, formatDate, formatTime12 } from '../utils/helpers';
import { APPOINTMENT_STATUS } from '../utils/constants';
import { getDoctorPhoto } from '../utils/doctorPhotoMapper';
import { 
  Play, 
  CheckSquare, 
  SkipForward, 
  Users, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  Ban,
  ClipboardList
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [queues, setQueues] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamically bound doctor ID from auth session
  const doctorId = user?.doctorId || user?.id || 1;  

  const loadData = async () => {
    try {
      // Get doctor profile details dynamically to show the correct image!
      try {
        const profile = await doctorService.getDoctorById(doctorId);
        setDoctorProfile(profile);
      } catch (profileErr) {
        console.error('Failed to load doctor profile detail:', profileErr);
      }

      // Get all appointments corresponding to this doctor
      const appointmentsData = await appointmentService.getAppointments({ doctorId });
      setAppointments(appointmentsData);

      // Get active queues
      const queueData = await queueService.getQueueStatus();
      setQueues(queueData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync doctor logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // 10s poll
    return () => clearInterval(interval);
  }, [user]);

  // Find this doctor's specific queue status
  const doctorQueue = queues.find((q) => q.doctorId === doctorId) || null;

  // Filter today's pending/confirmed appointments
  const pendingAppointments = appointments.filter(
    (a) => a.status === APPOINTMENT_STATUS.PENDING
  ).sort((a, b) => a.tokenNumber - b.tokenNumber);

  const activeConsultation = appointments.find(
    (a) => a.status === APPOINTMENT_STATUS.CONFIRMED
  ) || null;

  const completedConsultations = appointments.filter(
    (a) => a.status === APPOINTMENT_STATUS.COMPLETED || a.status === APPOINTMENT_STATUS.SKIPPED || a.status === APPOINTMENT_STATUS.CANCELLED
  );

  const handleCallNext = async () => {
    if (pendingAppointments.length === 0) {
      toast.error('No pending patients are left in your queue line.');
      return;
    }
    const nextPatient = pendingAppointments[0];
    try {
      await queueService.callNext(doctorId);
      toast.success(`Patient Calling! Token: ${formatToken(nextPatient.tokenNumber)}`);
      loadData();
    } catch (err) {
      toast.error('Failed to command next patient consult.');
    }
  };

  const handleCompleteActive = async () => {
    if (!activeConsultation) {
      toast.error('You do not have any active patient consulting currently.');
      return;
    }
    try {
      await queueService.completeToken(doctorId, activeConsultation.tokenNumber);
      toast.success(`Consult Completed! Token ${formatToken(activeConsultation.tokenNumber)} cleared.`);
      loadData();
    } catch (err) {
      toast.error('Failed to complete consultation.');
    }
  };

  const handleSkipActive = async () => {
    if (!activeConsultation) {
      toast.error('You do not have any active patient to skip.');
      return;
    }
    try {
      await queueService.skipToken(doctorId, activeConsultation.tokenNumber);
      toast.success(`Token ${formatToken(activeConsultation.tokenNumber)} Skipped.`);
      loadData();
    } catch (err) {
      toast.error('Failed to skip token.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#F8FAFC]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
          <Topbar title="Connecting Doctor Desk..." />
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
            <Loader size="large" text="Syncing consultation boards..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans" id="sc-doctor-dash">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar title="Doctor Consultation Center" onMenuClick={onMenuClick} />

        <main className="p-6 md:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto animate-fadeIn">
          
          {/* Welcome and Doctor Profile Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-[32px] p-6 lg:p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-60 h-60 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="space-y-3.5 text-center md:text-left flex-1 z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                ● CLINICAL PRACTITIONER STATION
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Good day, {user?.name || 'Doctor'}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Connect with secure patient health files, manage real-time OPD queue timelines, and finalize consultation transcripts instantly inside a single pane of glass.
              </p>
            </div>

            {/* Premium, clean-styled doctor picture with light blue/white ambient background */}
            <div className="w-full md:w-64 h-32 rounded-2xl overflow-hidden shrink-0 relative border border-slate-700/50 shadow-md">
              <img 
                src={getDoctorPhoto(user?.name, user?.gender)} 
                alt="Doctor Station Desk" 
                className="w-full h-full object-cover object-top brightness-95 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
            </div>
          </div>

          {/* Welcome and live status top row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-3 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl" />
              <div className="flex justify-between items-center relative z-10">
                <p className="text-[10px] font-extrabold text-sky-400 tracking-wider uppercase font-mono">Serving Now</p>
                <Users className="w-4.5 h-4.5 text-sky-400 animate-pulse" />
              </div>
              <h3 className="font-mono text-3.5xl font-black text-white relative z-10">
                {doctorQueue ? formatToken(doctorQueue.currentToken) : 'SC000'}
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-none relative z-10">Active Token on Monitor Board</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 relative group">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase font-mono group-hover:text-emerald-600 transition-colors">Patients Waiting</p>
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-sans text-3.5xl font-extrabold text-slate-900">
                {pendingAppointments.length}
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-none">Remaining tokens in hallway</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 space-y-3 relative group">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase font-mono group-hover:text-teal-600 transition-colors">Served Consultations</p>
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-sans text-3.5xl font-extrabold text-teal-600">
                {completedConsultations.filter(a => a.status === APPOINTMENT_STATUS.COMPLETED).length}
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-none">Check-ins successfully served</p>
            </div>

          </div>

          {/* Core Controls row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Queue controls */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 space-y-6 shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest font-mono">
                  COCKPIT MODULE
                </span>
                <h3 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100/85 pb-3">
                  Live Operations Deck
                </h3>
              </div>

              {/* Patient in room box */}
              <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl text-center space-y-4 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none relative z-10">PATIENT INSIDE CONSULT ROOM</p>
                {activeConsultation ? (
                  <div className="space-y-3 animate-pulse relative z-10">
                    <span className="font-mono text-3xl font-black text-sky-600 block bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 inline-block">
                      {formatToken(activeConsultation.tokenNumber)}
                    </span>
                    <div>
                      <p className="text-base font-extrabold text-slate-900 font-display leading-snug">{activeConsultation.patientName}</p>
                      <p className="text-xs text-slate-400 mt-1 italic">Notes: {activeConsultation.notes || 'No symptoms specified'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-405 font-medium italic py-5 text-slate-400 relative z-10">
                    Lobby channel idle. Please summon the next patient.
                  </p>
                )}
              </div>

              {/* Button controllers */}
              <div className="space-y-3">
                <button
                  onClick={handleCallNext}
                  disabled={pendingAppointments.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 active:scale-98 text-white px-5 py-4 rounded-2xl text-xs font-bold font-display disabled:opacity-40 transition-all shadow-md shadow-sky-100 cursor-pointer"
                  id="doctor-call-next-btn"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Call Next Patient ({pendingAppointments.length > 0 ? formatToken(pendingAppointments[0].tokenNumber) : 'None'})
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCompleteActive}
                    disabled={!activeConsultation}
                    className="flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white border border-emerald-100 hover:border-transparent rounded-2xl py-3.5 text-xs font-bold disabled:opacity-40 transition-all cursor-pointer"
                    id="doctor-complete-consult-btn"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Complete
                  </button>
                  <button
                    onClick={handleSkipActive}
                    disabled={!activeConsultation}
                    className="flex items-center justify-center gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white border border-amber-100 hover:border-transparent rounded-2xl py-3.5 text-xs font-bold disabled:opacity-40 transition-all cursor-pointer"
                    id="doctor-skip-consult-btn"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip Token
                  </button>
                </div>
              </div>

            </div>

            {/* Right Patient Lists table */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest font-mono">
                  OPD SCHEDULER
                </span>
                <h3 className="font-display font-extrabold text-base text-slate-900">
                  Waiting Patients List ({pendingAppointments.length})
                </h3>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-xs text-left text-slate-500">
                  <thead className="bg-[#F8FAFC] text-slate-400 capitalize font-bold leading-normal border-b border-slate-100">
                    <tr>
                      <th className="p-4">Token Code</th>
                      <th className="p-4">Outpatient Identity</th>
                      <th className="p-4">Time Slot</th>
                      <th className="p-4">Chief complaint / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-sky-600">
                          <span className="bg-sky-50 border border-sky-100 px-2 py-1 rounded">
                            {formatToken(appt.tokenNumber)}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-slate-900 font-display">{appt.patientName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">ID: PT#{String(appt.patientId).padStart(3, '0')}</span>
                        </td>
                        <td className="p-4 font-medium text-slate-700 font-mono">
                          {formatTime12(appt.appointmentTime)}
                        </td>
                        <td className="p-4 text-slate-500 italic max-w-xs truncate">
                          {appt.notes || 'Routine checkup.'}
                        </td>
                      </tr>
                    ))}

                    {pendingAppointments.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-10 text-center text-slate-400 italic">
                          All consultation queues completed! No outpatient tokens remaining.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Historical consulting logs */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-xs space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest font-mono">
                COMPLETED REGISTRY
              </span>
              <h3 className="font-display font-extrabold text-base text-slate-900">
                Outpatient Consultation Log History ({completedConsultations.length})
              </h3>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-xs text-left text-slate-500">
                <thead className="bg-[#F8FAFC] text-slate-400 capitalize font-bold leading-normal border-b border-slate-100">
                  <tr>
                    <th className="p-4">Token</th>
                    <th className="p-4">Outpatient Name</th>
                    <th className="p-4">Outcome Status</th>
                    <th className="p-4">Consulted On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedConsultations.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-500">{formatToken(c.tokenNumber)}</td>
                      <td className="p-4 font-bold text-slate-900 font-display">{c.patientName}</td>
                      <td className="p-4">
                        {c.status === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold bg-[#ECFDF5] text-emerald-700 border border-emerald-150 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                            ● COMPLETED
                          </span>
                        ) : c.status === 'SKIPPED' ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold bg-[#FFFBEB] text-amber-705 border border-amber-150 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                            ● SKIPPED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                            ● CANCELLED
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-400 font-medium font-mono">{formatDate(c.appointmentDate)}</td>
                    </tr>
                  ))}
                  {completedConsultations.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-350 italic">No previous consultation logs found in current sessions.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
