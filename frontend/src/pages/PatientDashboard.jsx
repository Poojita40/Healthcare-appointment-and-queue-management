import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AppointmentCard from '../components/AppointmentCard';
import QueueTrackingCard from '../components/QueueTrackingCard';
import Loader from '../components/Loader';
import { appointmentService } from '../services/appointmentService';
import { queueService } from '../services/queueService';
import { useAuth } from '../context/AuthContext';
import { formatToken } from '../utils/helpers';
import { APPOINTMENT_STATUS } from '../utils/constants';
import { Calendar, User, Clock, Bell, Layers, PlusCircle, ArrowRight, ShieldCheck, Timer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PatientDashboard({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const loadData = async () => {
    if (!user) return;
    try {
      // Get all appointments corresponding to current logged in patient
      const appointmentsData = await appointmentService.getAppointments({ patientId: user.id });
      setAppointments(appointmentsData);

      // Get active queue statistics
      const queueData = await queueService.getQueueStatus();
      setQueues(queueData);

      // Set notifications
      const activeAppt = appointmentsData.find(a => a.status === APPOINTMENT_STATUS.PENDING || a.status === APPOINTMENT_STATUS.CONFIRMED);
      
      const staticNotifs = [
        { id: 1, title: 'Profile Configured', desc: 'Secure patient file connected to SmartCare core auth.' },
      ];
      
      if (activeAppt) {
        staticNotifs.unshift({
          id: 2,
          title: `Active Queue Token: ${formatToken(activeAppt.tokenNumber)}`,
          desc: `You have an active consult session scheduled with ${activeAppt.doctorName}.`
        });
      }
      setNotifications(staticNotifs);
    } catch (err) {
      console.error('Failed to load patient dashboard telemetry', err);
      toast.error('Could not load real-time database elements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Establish a live update poller to simulate moving queue tokens
    const timer = setInterval(() => {
      loadData();
    }, 12000);
    return () => clearInterval(timer);
  }, [user]);

  const handleCancelAppointment = async (apptId) => {
    if (!window.confirm('Are you sure you wish to cancel this scheduled appointment?')) return;
    try {
      await appointmentService.updateAppointment(apptId, { status: APPOINTMENT_STATUS.CANCELLED });
      toast.success('Your appointment booking has been cancelled.');
      loadData();
    } catch (err) {
      toast.error('Failed to cancel appointment.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar title="Loading Dashboard..." />
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
            <Loader size="large" text="Syncing patient file history..." />
          </div>
        </div>
      </div>
    );
  }

  // Segment active vs past bookings
  const activeBookings = appointments.filter(
    (a) => a.status === APPOINTMENT_STATUS.PENDING || a.status === APPOINTMENT_STATUS.CONFIRMED
  );
  const pastBookings = appointments.filter(
    (a) => a.status === APPOINTMENT_STATUS.COMPLETED || a.status === APPOINTMENT_STATUS.CANCELLED || a.status === APPOINTMENT_STATUS.SKIPPED
  );

  // Check if patient has any pending appointment token
  const nextActive = activeBookings[0] || null;

  // Find related queue if we have active appointment
  const currentQueueInfo = nextActive 
    ? queues.find(q => q.doctorId === nextActive.doctorId) || (queues.length > 0 ? queues[0] : null)
    : (queues.length > 0 ? queues[0] : null);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans" id="sc-patient-dash">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar title="Patient Portal Overview" onMenuClick={onMenuClick} />

        <main className="p-6 md:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto animate-fadeIn">
          
          {/* Welcome Alert with Right Side Image */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-[32px] p-6 lg:p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Glowing background circles */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="space-y-3.5 text-center md:text-left flex-1 z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                ● PATIENT DESK ACTIVE
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
                Welcome back, {user?.name}!
                <span className="text-sky-450 animate-bounce">✨</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Superimpose outpatient appointment timers, monitor live doctor queue boards, or request a general consult room instantly through our secure medical gateway.
              </p>
              <div className="pt-2 select-none">
                <button
                  onClick={() => navigate('/book-appointment')}
                  className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 active:scale-98 text-white px-6 py-3.5 rounded-2xl text-xs font-bold font-display cursor-pointer shadow-lg shadow-sky-600/15 border border-sky-500 transition-all"
                >
                  <PlusCircle className="w-4.5 h-4.5" />
                  Book New Consultation
                </button>
              </div>
            </div>

            {/* Clinic / Nurse / Patient care photograph aligned at the right side */}
            <div className="w-full md:w-64 h-32 rounded-2xl overflow-hidden shrink-0 relative border border-slate-700/50 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400" 
                alt="Clinic consultation space" 
                className="w-full h-full object-cover object-center brightness-90 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Core Row Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Queue Panel: Grid column 8 */}
            <div className="lg:col-span-8 space-y-6 lg:space-y-8">
              
              {/* Virtual token status bar */}
              {currentQueueInfo && (
                <QueueTrackingCard
                  queue={currentQueueInfo}
                  yourTokenNumber={nextActive ? nextActive.tokenNumber : null}
                  status={nextActive ? nextActive.status : 'PENDING'}
                  onRefresh={loadData}
                />
              )}

              {/* Active Bookings list */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest font-mono">
                    YOUR VISITS
                  </span>
                  <h3 className="font-display font-extrabold text-base text-slate-900">
                    Upcoming Consultations Live ({activeBookings.length})
                  </h3>
                </div>

                {activeBookings.length > 0 ? (
                  <div className="space-y-4">
                    {activeBookings.map((appt) => (
                      <AppointmentCard
                        key={appt.id}
                        appointment={appt}
                        cancelable={true}
                        onCancel={handleCancelAppointment}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 text-center rounded-3xl border border-dashed border-slate-250 space-y-4">
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      You contain no scheduled clinic consultation requests on file. Request a health check slot to trigger visual tracking trackers.
                    </p>
                    <button
                      onClick={() => navigate('/book-appointment')}
                      className="text-xs font-bold text-sky-650 hover:text-sky-750 bg-sky-50 hover:bg-sky-100 border border-sky-100/50 px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-block"
                    >
                      Book First Appointment
                    </button>
                  </div>
                )}
              </div>

              {/* Patient Bio metadata card */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-5 shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-650 uppercase tracking-widest font-mono">
                    HEALTH PASSPORT
                  </span>
                  <h4 className="font-display font-extrabold text-base text-slate-900">
                    Registered Patient File Details
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100/80">
                    <p className="text-slate-400 font-extrabold uppercase text-[9px] font-mono">Biological Gender</p>
                    <p className="text-slate-800 font-display font-bold mt-1.5">{user?.gender || 'Not specified'}</p>
                  </div>
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100/80">
                    <p className="text-slate-400 font-extrabold uppercase text-[9px] font-mono">Age Profile</p>
                    <p className="text-slate-800 font-display font-bold mt-1.5">{user?.age ? `${user?.age} Years` : 'Not specified'}</p>
                  </div>
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100/85 col-span-2">
                    <p className="text-slate-400 font-extrabold uppercase text-[9px] font-mono">Residence Address</p>
                    <p className="text-slate-800 font-display font-bold mt-1.5 truncate">{user?.address || 'Not registered in passport'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Notifications list: Grid column 4 */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Quick action buttons shortcut block */}
              <div className="bg-white p-6 border border-slate-100 rounded-3xl space-y-4 shadow-xs">
                <h4 className="font-display font-extrabold text-xs text-slate-400 uppercase tracking-widest font-mono mb-2">Patient Quick Actions</h4>
                
                <button
                  onClick={() => navigate('/book-appointment')}
                  className="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-[#F0F7FF] rounded-2xl text-left border border-slate-100 hover:border-sky-200 transition-all text-xs font-bold text-slate-700 hover:text-sky-700 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5"><Calendar className="w-4.5 h-4.5 text-sky-500" /> Book Consultation</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => navigate('/appointment-history')}
                  className="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-[#F0F7FF] rounded-2xl text-left border border-slate-100 hover:border-sky-200 transition-all text-xs font-bold text-slate-700 hover:text-sky-700 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5"><Clock className="w-4.5 h-4.5 text-emerald-500" /> Appointment History</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-[#F0F7FF] rounded-2xl text-left border border-slate-100 hover:border-sky-200 transition-all text-xs font-bold text-slate-700 hover:text-sky-700 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5"><User className="w-4.5 h-4.5 text-purple-500" /> Profile Information</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Notification feed */}
              <div className="bg-white p-6 border border-slate-100 rounded-3xl space-y-5 shadow-xs">
                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-xs text-slate-400 uppercase tracking-widest font-mono">Patient Live Alerts</h4>
                </div>
                
                <div className="space-y-3.5">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100/50">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-slate-900 font-display truncate leading-tight">{notif.title}</h5>
                        <p className="text-[11px] text-slate-400 leading-snug mt-1">{notif.desc}</p>
                      </div>
                    </div>
                  ))}
                  
                  {notifications.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No active broadcasts or alerts on monitor file.</p>
                  )}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
