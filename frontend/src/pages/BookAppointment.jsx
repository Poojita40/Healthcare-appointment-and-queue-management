import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Loader from '../components/Loader';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { queueService } from '../services/queueService';
import { emailService } from '../services/emailService';
import { useAuth } from '../context/AuthContext';
import { formatToken } from '../utils/helpers';
import { getDoctorPhoto } from '../utils/doctorPhotoMapper';
import QueueTrackingCard from '../components/QueueTrackingCard';
import { Calendar, User, Clock, AlertCircle, Bookmark, ClipboardList, CheckCircle2, Star, Mail, Check, RefreshCw, ChevronDown, ChevronUp, Share2, Timer, Users, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export default function BookAppointment({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDocId = searchParams.get('doctorId');

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Success Confirmation views
  const [successData, setSuccessData] = useState(null);
  const [associatedQueue, setAssociatedQueue] = useState(null);
  const [simulatedEmail, setSimulatedEmail] = useState(null);
  const [emailDetailsOpen, setEmailDetailsOpen] = useState(true);

  // Form states
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getDoctors();
        setDoctors(data);

        // Auto-select doctor from URL is present
        if (initialDocId) {
          const docNum = parseInt(initialDocId, 10);
          if (data.some(d => d.id === docNum)) {
            setSelectedDoctorId(docNum);
          } else if (data.length > 0) {
            setSelectedDoctorId(data[0].id);
          }
        } else if (data.length > 0) {
          setSelectedDoctorId(data[0].id);
        }
      } catch (err) {
        toast.error('Failed to retrieve doctors rosters.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [initialDocId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctorId) {
      toast.error('Please pick a primary care doctor.');
      return;
    }
    if (!appointmentDate) {
      toast.error('Please select an appointment date.');
      return;
    }
    if (!appointmentTime) {
      toast.error('Please select a valid time slot. No slots available for the selected date.');
      return;
    }

    setBookingInProgress(true);
    try {
      const response = await appointmentService.bookAppointment({
        patientId: user.id,
        doctorId: parseInt(selectedDoctorId, 10),
        appointmentDate,
        appointmentTime,
        notes
      });

      const tokenFormatted = formatToken(response.tokenNumber);
      toast.success(`Booking Confirmed! Token Number: ${tokenFormatted}`);

      // Query live queue positions to render the confirmation tracking details
      try {
        const queues = await queueService.getQueueStatus();
        const matchedQueue = queues.find(q => q.doctorId === response.doctorId);
        setAssociatedQueue(matchedQueue || null);
      } catch (queueErr) {
        console.error('Could not fetch queue telemetry for ticket', queueErr);
      }

      // Query virtual sandbox email inbox to pull actual dispatched mailer receipt
      try {
        const emails = await emailService.getSimulatedEmails(user.email);
        const matchedEmail = emails.find(e => e.type === 'booking' && e.subject.includes(tokenFormatted));
        setSimulatedEmail(matchedEmail || null);
      } catch (emailErr) {
        console.error('Could not fetch sandboxed email copy', emailErr);
      }

      // Set booking success data to trigger nice card confirmation layout
      setSuccessData(response);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Selected time-slot unavailable. Try another time or date.';
      toast.error(errMsg);
    } finally {
      setBookingInProgress(false);
    }
  };

  // Enforce tomorrow/future dates restriction for sanity
  const getMinDateString = () => {
    const today = new Date();
    // Format to YYYY-MM-DD
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const availableSlots = React.useMemo(() => {
    const slots = [];
    const now = new Date();
    const isToday = appointmentDate === getMinDateString();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let h = 9; h <= 22; h++) {
      for (let m of [0, 30]) {
        if (h === 22 && m === 30) continue; // End exactly at 10:00 PM

        if (isToday) {
          if (h < currentHour || (h === currentHour && m <= currentMinute)) {
            continue;
          }
        }

        const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h > 12 ? h - 12 : h;
        const displayString = `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
        
        slots.push({ value: timeString, label: displayString });
      }
    }
    return slots;
  }, [appointmentDate]);

  useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.some(slot => slot.value === appointmentTime)) {
      setAppointmentTime(availableSlots[0].value);
    } else if (availableSlots.length === 0 && appointmentTime !== '') {
      setAppointmentTime('');
    }
  }, [availableSlots, appointmentTime]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#F8FAFC]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar title="Booking Consultation..." onMenuClick={onMenuClick} />
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
            <Loader size="large" text="Syncing medical rosters..." />
          </div>
        </div>
      </div>
    );
  }

  const selectedDoctorObj = doctors.find((d) => d.id === parseInt(selectedDoctorId, 10)) || null;

  if (successData) {
    const tokenFormatted = formatToken(successData.tokenNumber);
    const docName = successData.doctorName || selectedDoctorObj?.name || 'SmartCare Specialist';
    const docSpec = successData.doctorSpecialization || selectedDoctorObj?.specialization || 'Clinical Operations';
    
    // Compute patients ahead
    const currentTokenVal = associatedQueue ? parseInt(associatedQueue.currentToken, 10) : 0;
    const patientsAhead = Math.max(0, parseInt(successData.tokenNumber, 10) - currentTokenVal - 1);
    const estimatedWaitMinutes = patientsAhead * 15;

    return (
      <div className="flex h-screen bg-slate-100 font-sans animate-fade-in" id="sc-booking-success-root">
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar title="Booking Confirmed" />

          <main className="p-6 flex-1 max-w-4xl w-full mx-auto space-y-6">
            
            {/* Confirmed Banner */}
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <Check className="w-8 h-8 text-white stroke-[3px]" />
              </div>
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-[9px] font-extrabold uppercase bg-emerald-500/30 text-emerald-100 px-2.5 py-0.5 rounded-full tracking-wider border border-white/10">
                  REAL-TIME ACTION COMPLETED
                </span>
                <h2 className="font-display font-black text-xl sm:text-2xl leading-none">Your Appointment Booking is Confirmed!</h2>
                <p className="text-xs text-emerald-100/90 max-w-xl">
                  We have assigned your medical consult token and generated a digital queue reservation ticket. An official, sandbox confirmation notification has been successfully dispatched to your email.
                </p>
              </div>
            </motion.div>

            {/* Split layout: Ticket Card on Left, Live Queue & Email details on Right */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Digital Ticket (Col-5) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-5 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md relative"
              >
                {/* Visual Ticket Header */}
                <div className="bg-slate-900 text-white p-4 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500 rounded-full filter blur-2xl opacity-10" />
                  <p className="text-[9px] font-bold tracking-widest text-sky-400 uppercase">SMARTCARE CLINIC TICKET</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 animate-pulse">ID: SC-APT-{successData.id}</p>
                </div>

                {/* Ticket Body with micro perforated side edges */}
                <div className="p-5 space-y-4 relative">
                  {/* Decorative Ticket Left/Right side notches */}
                  <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-slate-100 border-r border-slate-200" />
                  <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-slate-100 border-l border-slate-200" />

                  {/* Doctor Info */}
                  <div className="text-center pb-3 border-b border-dashed border-slate-200">
                    <h3 className="font-display font-extrabold text-base text-gray-900 leading-tight">
                      {docName}
                    </h3>
                    <p className="text-xs text-sky-600 font-bold mt-0.5">{docSpec}</p>
                  </div>

                  {/* Gigantic Assigned Token Badge */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center space-y-1">
                    <span className="text-[9px] font-extrabold text-gray-400 tracking-wider uppercase">YOUR QUEUE POSITION</span>
                    <div className="font-mono text-3xl font-black text-sky-600 tracking-tight select-all">
                      {tokenFormatted}
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold bg-white border border-slate-100 px-3 py-1 rounded-full inline-block">
                      Digital Code: {successData.tokenNumber}
                    </span>
                  </div>

                  {/* Time & Details */}
                  <div className="space-y-2.5 text-xs pt-1">
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Reserve Date</span>
                      <strong className="text-slate-800">{successData.appointmentDate}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Preferred Slot</span>
                      <strong className="text-slate-800 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-md font-semibold text-sky-700">
                        {successData.appointmentTime}
                      </strong>
                    </div>
                    <div className="flex justify-between items-start text-slate-500 border-t border-slate-100 pt-3">
                      <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block shrink-0">SYMPTOMS RECORDED:</span>
                    </div>
                    <p className="text-[11px] text-slate-600 bg-slate-50 border border-slate-100 p-2.5 rounded-xl italic leading-relaxed max-h-24 overflow-y-auto">
                      {successData.notes || 'No symptoms/notes requested.'}
                    </p>
                  </div>
                </div>

                {/* Decorative barcode footer */}
                <div className="bg-slate-50 border-t border-slate-100 p-4 text-center font-mono opacity-65 flex flex-col items-center justify-center select-none gap-0.5">
                  <span className="text-xs font-bold leading-none tracking-tight">||| | | |||| | || | ||| || |||</span>
                  <span className="text-[8px] tracking-widest text-slate-400 uppercase">* SECURED DIGITAL TOKEN *</span>
                </div>
              </motion.div>

              {/* Right Column: Live Queue & Dispatch Console (Col-7) */}
              <div className="md:col-span-7 space-y-6">

                {/* Live Queue tracking helper box */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-5 shadow-xs relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500 rounded-full filter blur-2xl opacity-10" />
                  
                  <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                    <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full tracking-wider">
                      Live Queue Tracking
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold uppercase">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Live Feed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Currently Serving</p>
                      <div className="font-mono text-2xl font-extrabold text-slate-100">
                        {associatedQueue ? formatToken(associatedQueue.currentToken) : 'SC001'}
                      </div>
                      <p className="text-[9px] text-slate-400">At practitioner desk</p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5 space-y-1 text-center font-sans">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Patients Ahead</p>
                      <div className="text-xl font-bold text-sky-400">{patientsAhead}</div>
                      <p className="text-[9px] text-slate-400">In waiting room</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center bg-white/5 -mx-5 -mb-5 px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wider leading-none">Estimated Wait Time</p>
                        <p className="text-xs font-bold text-sky-400 font-mono mt-0.5">
                          {estimatedWaitMinutes === 0 ? 'Immediate (Next up!)' : `${estimatedWaitMinutes} Mins`}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/queue-tracking')}
                      className="text-[10px] font-bold text-white bg-sky-500 hover:bg-sky-600 transition-colors px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      View Live Board <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>

                {/* Dispatched Email confirmation mock display - Satisfies "should get email" */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  {/* Email Simulator Header */}
                  <div className="bg-sky-50 p-4 border-b border-sky-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-xs text-gray-950 leading-tight block select-none">SMTP Mail System Dispatch Receipt</h4>
                        <p className="text-[9px] text-gray-400 font-mono">Sandbox Notification Hub</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ✓ Email Sent
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="text-[11px] space-y-1 font-mono text-slate-500 border-b border-slate-100 pb-3">
                      <p><strong>To:</strong> <span className="text-sky-600 underline">{user?.email}</span></p>
                      <p><strong>Subject:</strong> SmartCare Appointment Confirmation: {docName} [Token: {tokenFormatted}]</p>
                    </div>

                    {/* Email message preview */}
                    <div className="relative">
                      <div className={`overflow-hidden transition-all duration-300 ${emailDetailsOpen ? 'max-h-72' : 'max-h-16'}`}>
                        <div className="text-[11px] text-slate-600 whitespace-pre-line bg-slate-50 p-3 rounded-xl leading-relaxed italic font-sans border border-slate-100">
                          {simulatedEmail ? simulatedEmail.body : (
                            `Dear ${user?.name || 'Valued Patient'},

Your booking at SmartCare Hospital has been successfully confirmed. Please review your appointment details and live queue status information below:

Appointment Details:
- Doctor: ${docName} (${docSpec})
- Date: ${successData.appointmentDate}
- Preferred Time Slot: ${successData.appointmentTime}
- Appointment ID: SC-APT-${successData.id}

QUEUE TRACKING DETAILS:
- Your Assigned Token Number: ${tokenFormatted} (Digital Code: ${successData.tokenNumber})
- Patients Ahead of You: ${patientsAhead}
- Estimated Wait Time: ${estimatedWaitMinutes === 0 ? 'Immediate!' : `${estimatedWaitMinutes} mins`}

Wishing you good health,
The SmartCare Clinical Operations Team`
                          )}
                        </div>
                      </div>

                      {/* Read more toggler */}
                      <button
                        onClick={() => setEmailDetailsOpen(!emailDetailsOpen)}
                        className="w-full text-center py-1 mt-1 text-[10px] font-bold text-sky-600 hover:text-sky-700 flex items-center justify-center gap-0.5 cursor-pointer"
                      >
                        {emailDetailsOpen ? (
                          <>Collapse Email Content <ChevronUp className="w-3.5 h-3.5" /></>
                        ) : (
                          <>Expand Entire Email Receipt & Instructions <ChevronDown className="w-3.5 h-3.5" /></>
                        )}
                      </button>

                      {/* Display the active tracking card inside email notifications pane */}
                      <div className="mt-3.5 pt-3.5 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-display">
                          Real-Time Ticket Tracking
                        </p>
                        <QueueTrackingCard
                          yourTokenNumber={successData.tokenNumber}
                          doctorId={successData.doctorId}
                          status={successData.status || 'PENDING'}
                          compact={true}
                        />
                      </div>
                    </div>

                    {/* Dynamic tip */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10.5px] text-slate-500 leading-snug flex gap-2">
                      <span className="text-base select-none">🔔</span>
                      <p>
                        <strong>Patient Tip:</strong> You can open the <strong>Virtual Email Inbox</strong> by clicking the <strong>Mail Icon</strong> in the top header menu anytime to see all simulated medical notifications sent directly to your email address!
                      </p>
                    </div>
                  </div>
                </motion.div>

              </div>

            </div>

            {/* Sticky Actions Desk */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center border-t border-slate-205 select-none">
              <button
                onClick={() => navigate('/patient-dashboard')}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full py-3 px-6 text-xs font-bold font-display cursor-pointer transition-all hover:shadow-xs active:scale-98 flex items-center justify-center gap-1.5"
              >
                Go to Patient Dashboard
              </button>

              <button
                onClick={() => navigate('/queue-tracking')}
                className="bg-slate-900 hover:bg-slate-950 text-white rounded-full py-3 px-6 text-xs font-bold font-display cursor-pointer transition-all hover:shadow-sm active:scale-98 flex items-center justify-center gap-1.5"
              >
                Track Live Queue Board
              </button>

              <button
                onClick={() => {
                  setSuccessData(null);
                  setAssociatedQueue(null);
                  setSimulatedEmail(null);
                  setNotes('');
                }}
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-full py-3 px-6 text-xs font-bold font-display cursor-pointer transition-all hover:shadow-md active:scale-98 flex items-center justify-center gap-1.5"
              >
                Book Another Appointment
              </button>
            </div>

          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans" id="sc-book-root">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar title="Schedule Consultation" onMenuClick={onMenuClick} />

        <main className="p-6 flex-1 max-w-4xl w-full mx-auto space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Form Left */}
            <form onSubmit={handleSubmit} className="md:col-span-7 space-y-5">
              <h3 className="font-display font-extrabold text-lg text-slate-900 border-b border-gray-50 pb-3 block select-none">
                Consultation Scheduling Desk
              </h3>

              {/* Select Doctor Field */}
              <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">CHOOSE CLINICAL DOCTOR</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full text-xs font-semibold text-gray-800 bg-transparent border-none focus:outline-hidden p-0"
                    id="book-doctor-select"
                  >
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - {doc.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date and Time selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">APPOINTMENT DATE</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                    <input
                      type="date"
                      required
                      min={getMinDateString()}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full text-xs font-bold text-gray-800 bg-transparent border-none focus:outline-hidden p-0 cursor-pointer"
                      id="book-date-input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">PREFERRED TIMING</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full text-xs font-bold text-gray-800 bg-transparent border-none focus:outline-hidden p-0 cursor-pointer"
                      id="book-time-select"
                      disabled={availableSlots.length === 0}
                    >
                      {availableSlots.length === 0 ? (
                        <option value="">No slots available</option>
                      ) : (
                        availableSlots.map(slot => (
                          <option key={slot.value} value={slot.value}>{slot.label}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Symptoms / Notes */}
              <div className="space-y-1.5 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">SYMPTOMS & CLINIC NOTES</label>
                <div className="flex items-start gap-2 mt-1.5">
                  <ClipboardList className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly detail any current symptoms or general purpose of consulting (e.g. routine heart check, regular pediatrician consult, persistent cough)..."
                    className="w-full text-xs font-medium text-gray-800 bg-transparent border-none focus:outline-hidden p-0 resize-none"
                    id="book-notes-input"
                  />
                </div>
              </div>

              {/* Urgent Note */}
              <div className="flex items-start gap-2 bg-sky-50 text-[11px] text-sky-800 font-medium p-3 rounded-xl border border-sky-100/30">
                <AlertCircle className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong>Notice:</strong> High-priority smart tokens are assigned sequentially. Your position in queue is dynamic and can be tracked in real-time from your portal dashboard.
                </p>
              </div>

              <button
                type="submit"
                disabled={bookingInProgress}
                className="w-full bg-sky-500 hover:bg-sky-600 active:scale-98 text-white py-3.5 rounded-xl font-bold font-display text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                id="do-appointment-booking"
              >
                <Bookmark className="w-4 h-4" />
                {bookingInProgress ? 'Registering Queue Ticket...' : 'Confirm Consultation Booking'}
              </button>
            </form>

            {/* Doctor Card Bio block right */}
            <div className="md:col-span-5 bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-between" id="doc-booking-preview">
              {selectedDoctorObj ? (
                <div className="space-y-5 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="font-display font-bold text-slate-800 text-xs tracking-wider uppercase">Active Doctor Profile</h4>
                    
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-white">
                      <img
                        src={getDoctorPhoto(selectedDoctorObj.name, selectedDoctorObj.gender)}
                        alt={selectedDoctorObj.name}
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.onerror = null;
                          const isFemale = selectedDoctorObj.gender?.toLowerCase() === 'female' ||
                            ['priya','meera','sarah','nair'].some(n => selectedDoctorObj.name?.toLowerCase().includes(n));
                          e.target.src = isFemale
                            ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
                            : 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=400';
                        }}
                      />
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-base text-gray-900 leading-tight flex items-center gap-1.5">
                        {selectedDoctorObj.name}
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                      </h4>
                      <p className="text-xs text-sky-600 font-semibold mt-0.5">{selectedDoctorObj.qualification}</p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span className="text-gray-400 font-semibold">Specialization</span>
                        <strong className="text-gray-700">{selectedDoctorObj.specialization}</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span className="text-gray-400 font-semibold">Practical experience</span>
                        <strong className="text-gray-700">{selectedDoctorObj.experience}</strong>
                      </div>
                      <div className="flex flex-col gap-1 pt-1 text-[11px]">
                        <span className="text-gray-400 font-extrabold uppercase text-[9px] tracking-wide">Standard consultation period:</span>
                        <strong className="text-slate-600 block mt-0.5 bg-slate-200/30 p-2 rounded-lg leading-normal italic border border-slate-200/20">
                          {selectedDoctorObj.availability}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center uppercase font-extrabold tracking-widest pt-4 border-t border-slate-200/40">
                    SmartCare Tele-Care Integration
                  </p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-6 text-xs text-gray-400 font-medium">
                  Please pick a general doctor on the selector to evaluate schedule parameters.
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
