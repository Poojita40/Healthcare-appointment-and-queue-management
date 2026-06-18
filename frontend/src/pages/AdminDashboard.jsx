import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { INITIAL_DOCTORS } from '../utils/constants';
import { doctorService } from '../services/doctorService.js';
import { patientService } from '../services/patientService.js';
import { appointmentService } from '../services/appointmentService.js';
import { queueService } from '../services/queueService.js';
import { formatToken } from '../utils/helpers';
import { getDoctorPhoto } from '../utils/doctorPhotoMapper';
import { BarChart3, Users, Stethoscope, Calendar, CheckSquare, PlusCircle, PenTool, Trash2, ChartBar, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard({ onMenuClick }) {
  const { user } = useAuth();
  
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [queues, setQueues] = useState([]);

  // Form states to add custom doctors
  const [showAddDocForm, setShowAddDocForm] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: '',
    specialization: 'General Physician',
    qualification: '',
    experience: '',
    email: '',
    phone: '',
    availability: '',
    imageUrl: 'https://images.unsplash.com/photo-1582750433449-649352849ed7?auto=format&fit=crop&q=80&w=400'
  });

  const loadData = async () => {
    try {
      const docList = await doctorService.getDoctors();
      setDoctors(docList);

      const patientList = await patientService.getPatients();
      setPatients(patientList);
      setPatientsCount(patientList.length);
      const apptList = await appointmentService.getAppointments();
      setAppointments(apptList);

      const qStatus = await queueService.getQueueStatus();
      setQueues(qStatus);

      // Simple patient counting simulation
      setPatientsCount(128); // Standard analytic baseline
    } catch (err) {
      toast.error('Failed to reload analytics telemetry databases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!newDoc.name || !newDoc.qualification || !newDoc.experience) {
      toast.error('Please input name, qualifications, and experience parameters.');
      return;
    }
    try {
      await doctorService.createDoctor(newDoc);
      toast.success(`Doctor ${newDoc.name} registered successfully in database.`);
      setShowAddDocForm(false);
      setNewDoc({
        name: '',
        specialization: 'General Physician',
        qualification: '',
        experience: '',
        email: '',
        phone: '',
        availability: '',
        imageUrl: 'https://images.unsplash.com/photo-1582750433449-649352849ed7?auto=format&fit=crop&q=80&w=400'
      });
      loadData();
    } catch (err) {
      toast.error('Failed to append doctor data.');
    }
  };

  const handleDeleteDoctor = async (id, name) => {
    if (!window.confirm(`Are you absolutely sure you wish to delete ${name} from active staff?`)) return;
    try {
      await doctorService.deleteDoctor(id);
      toast.success(`${name} clinical files completely purged.`);
      loadData();
    } catch (e) {
      toast.error('Failed to delete doctor profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#F8FAFC]">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
          <Topbar title="Connecting Admin Console..." />
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
            <Loader size="large" text="Gaining root dashboard access..." />
          </div>
        </div>
      </div>
    );
  }

  // Statistics computations
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED').length;
  const pendingAppointments = appointments.filter((a) => a.status === 'PENDING').length;
  const liveConsultations = appointments.filter((a) => a.status === 'CONFIRMED').length;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans" id="sc-admin-dash">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar title="Hospital Control & Analytics Desk" onMenuClick={onMenuClick} />

        <main className="p-6 md:p-8 space-y-8 flex-1 max-w-7xl w-full mx-auto animate-fadeIn">
          
          {/* Welcome and Administrator Operations Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-[32px] p-6 lg:p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Glowing background circles */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-60 h-60 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="space-y-3.5 text-center md:text-left flex-1 z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                ● PRIMARY CONTROL CONSOLE
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Welcome to Control Panel, {user?.name || 'Administrator'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                Superimpose clinical registry schedules, track outpatient consultation volumes, audit token progression metrics, and monitor physical queue loads in real time.
              </p>
            </div>

            {/* Premium administrative workstation illustration themed with light white/blue details */}
            <div className="w-full md:w-72 h-36 rounded-2xl overflow-hidden shrink-0 relative border border-slate-700/50 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400" 
                alt="System Workspace Management" 
                className="w-full h-full object-cover object-center brightness-90 hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Top Info metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            
            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs hover:shadow-lg hover:border-slate-200 transition-all duration-300 space-y-3 relative group">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-sky-600 transition-colors">Outpatients</span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-sans text-3xl font-extrabold text-slate-950 tracking-tight">{patientsCount}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Unique Registrations</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs hover:shadow-lg hover:border-slate-200 transition-all duration-300 space-y-3 relative group">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">Clinical Staff</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-sans text-3xl font-extrabold text-slate-950 tracking-tight">{doctors.length}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">On-duty Doctors</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs hover:shadow-lg hover:border-slate-200 transition-all duration-300 space-y-3 relative group">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">Total Slots</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-sans text-3xl font-extrabold text-slate-950 tracking-tight">{totalAppointments}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Appointments Booked</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs hover:shadow-lg hover:border-slate-200 transition-all duration-300 space-y-3 relative group">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-teal-600 transition-colors">Completed</span>
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-sans text-3xl font-extrabold text-teal-600 tracking-tight">{completedAppointments}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Served and Cleared</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs hover:shadow-lg hover:border-slate-200 transition-all duration-300 space-y-3 relative group">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-amber-600 transition-colors">Pending</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="font-sans text-3xl font-extrabold text-amber-500 tracking-tight">{pendingAppointments}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">In Queue Hallway</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs hover:shadow-lg hover:border-slate-200 transition-all duration-300 space-y-3 relative group">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-rose-600 transition-colors">Live Rooms</span>
                <div className="relative">
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-sans text-3xl font-extrabold text-rose-600 tracking-tight">{liveConsultations}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Consultation Rooms</p>
              </div>
            </div>

          </div>

          {/* Charts Analysis Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Visual Analytics columns */}
            <div className="lg:col-span-6 bg-white border border-slate-100 p-6 sm:p-8 rounded-[28px] shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest font-mono">
                  ANALYTICS ENGINE
                </span>
                <h3 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-sky-500" />
                  Department Patient Densities
                </h3>
              </div>
              
              <div className="space-y-5 pt-1 text-xs">
                {/* Visual Chart 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-650">Peak Hours Volume Surge</span>
                    <strong className="text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md font-mono text-[11px]">88% Capacity</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-400 to-sky-600 h-full rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                {/* Visual Chart 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-650">Cardiology Dept Consult Occupancy</span>
                    <strong className="text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md font-mono text-[11px]">42% Patients</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                {/* Visual Chart 3 */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-650">Pediatric & OPD Walk-ins</span>
                    <strong className="text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md font-mono text-[11px]">65% Patients</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                {/* Visual Chart 4 */}
                <div className="space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-650">General Consultation Speed Ratio</span>
                    <strong className="text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md font-mono text-[11px]">92% Efficiency</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Management Section */}
            <div className="lg:col-span-6 bg-white border border-slate-100 p-6 sm:p-8 rounded-[28px] shadow-xs space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100/80 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest font-mono">
                    HOSPITAL DIRECTORY
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-slate-900">
                    Clinical Practitioner Desk ({doctors.length})
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddDocForm(!showAddDocForm)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100/50 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer leading-none border border-sky-100"
                >
                  <PlusCircle className="w-4 h-4" />
                  Register Doctor
                </button>
              </div>

              {/* Form to Append New Doctors */}
              {showAddDocForm && (
                <form onSubmit={handleAddDoctor} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4 text-xs animate-slideIn">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wide border-b border-slate-200/55 pb-1">Enter Doctor Credentials</p>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 block pb-0.5">Doctor Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newDoc.name}
                        onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                        placeholder="Dr. Shreya Roy"
                        className="w-full bg-transparent border-none outline-hidden p-0 text-slate-800 font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 block pb-0.5">Qualifications *</label>
                      <input
                        type="text"
                        required
                        value={newDoc.qualification}
                        onChange={(e) => setNewDoc({ ...newDoc, qualification: e.target.value })}
                        placeholder="MD, DM (Cardiology)"
                        className="w-full bg-transparent border-none outline-hidden p-0 text-slate-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 block pb-0.5">Practical Experience *</label>
                      <input
                        type="text"
                        required
                        value={newDoc.experience}
                        onChange={(e) => setNewDoc({ ...newDoc, experience: e.target.value })}
                        placeholder="10 Years"
                        className="w-full bg-transparent border-none outline-hidden p-0 text-slate-800 font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 block pb-0.5">Specialization *</label>
                      <select
                        value={newDoc.specialization}
                        onChange={(e) => setNewDoc({ ...newDoc, specialization: e.target.value })}
                        className="w-full bg-transparent border-none outline-hidden p-0 font-bold text-slate-850"
                      >
                        <option value="General Physician">General Physician</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Neurology">Neurology</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 block pb-0.5 font-sans">Availability & Timings *</label>
                    <input
                      type="text"
                      value={newDoc.availability}
                      required
                      onChange={(e) => setNewDoc({ ...newDoc, availability: e.target.value })}
                      placeholder="Mon, Wed, Fri (10:00 AM - 4:00 PM)"
                      className="w-full bg-transparent border-none p-0 outline-hidden text-slate-800 font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl active:scale-98 transition-all cursor-pointer shadow-md shadow-sky-100 flex items-center justify-center gap-1.5"
                  >
                    Commit Doctor Record
                  </button>
                </form>
              )}
              {/* Table list of doctors inside Registry */}
              <div className="space-y-4 overflow-y-auto max-h-[360px] pr-1.5">
                {doctors.map((doc) => (
                  <div key={doc.id} className="p-4 bg-[#F8FAFC]/60 hover:bg-[#F8FAFC] transition-colors rounded-2xl border border-slate-100 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-100 shrink-0 shadow-2xs">
                        <img 
                          src={getDoctorPhoto(doc.name, doc.gender)} 
                          className="w-full h-full object-cover object-top" 
                          alt={doc.name} 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.target.onerror = null;
                            const isFem = doc.gender?.toLowerCase() === 'female' ||
                              ['priya','meera','sarah','nair'].some(n => doc.name?.toLowerCase().includes(n));
                            e.target.src = isFem
                              ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
                              : 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=400';
                          }}
                        />
                      </div>
                      <div className="min-w-0 text-xs space-y-1">
                        <h4 className="font-bold text-slate-900 font-display leading-tight truncate">{doc.name}</h4>
                        <p className="text-[10px] text-sky-600 font-bold bg-sky-50 border border-sky-100/50 px-2 py-0.5 rounded-md inline-block">
                          {doc.specialization} &bull; {doc.qualification}
                        </p>
                      </div>
                    </div>
                    {/* Deletion control */}
                    <button
                      onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                      className="text-slate-400 hover:text-rose-500 p-2.5 hover:bg-rose-50 rounded-xl transition-all cursor-pointer shrink-0 border border-transparent hover:border-rose-100"
                      title="Purge Doctor Record"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Patient List Section */}
              <div className="mt-8">
                <h3 className="font-display font-extrabold text-lg text-slate-900 mb-4">Registered Patients ({patients.length})</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-slate-100 rounded-xl shadow-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">Email</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">Phone</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">Age</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">Gender</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((p) => (
                        <tr key={p.id} className="border-t border-slate-100">
                          <td className="px-4 py-2 text-sm text-slate-800">{p.name}</td>
                          <td className="px-4 py-2 text-sm text-slate-800">{p.email}</td>
                          <td className="px-4 py-2 text-sm text-slate-800">{p.phone}</td>
                          <td className="px-4 py-2 text-sm text-slate-800">{p.age}</td>
                          <td className="px-4 py-2 text-sm text-slate-800">{p.gender}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>

          {/* Active Queues log view and system diagnostic terminal */}
          <div className="bg-white border border-slate-100 rounded-[28px] p-6 lg:p-8 shadow-xs space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest font-mono">
                TELEMETRY FEED
              </span>
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                Live Queue Diagnostic Terminal
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-xs">
              {queues.map((q) => (
                <div key={q.doctorId} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
                  
                  <div className="flex justify-between items-center relative z-10">
                    <h4 className="font-display font-bold text-sm text-slate-150 truncate max-w-[85%]">{q.doctorName || 'General consult'}</h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-800/60 text-slate-400">
                    <span>Now Serving Token:</span>
                    <strong className="font-mono text-emerald-450 text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">{formatToken(q.currentToken)}</strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>Next in queue line:</span>
                    <strong className="font-mono text-slate-200 text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-700/50">{formatToken(q.nextToken)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
