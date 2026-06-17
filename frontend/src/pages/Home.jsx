import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import DoctorCard from '../components/DoctorCard';

import ChatbotWidget from '../components/ChatbotWidget';
import { INITIAL_DOCTORS } from '../utils/constants';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Layers, 
  Activity, 
  ShieldCheck, 
  BellRing, 
  Compass, 
  UserPlus, 
  Briefcase, 
  ChevronRight, 
  Send,
  MapPin,
  Heart,
  Clock,
  Mail,
  User,
  Shield,
  Bone,
  Sparkles,
  Baby,
  Stethoscope,
  Phone,
  LogIn,
  Ticket,
  ScanLine,
  Eye,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState(null);

  const features = [
    {
      icon: Calendar,
      title: "Online Appointment Booking",
      description: "Secure immediate time slots with our world-class medical experts globally without back-and-forth phone calls.",
      colorClass: "bg-blue-50 text-blue-600 border border-blue-105"
    },
    {
      icon: Clock,
      title: "Live Queue Tracking",
      description: "Monitor live waiting progress and expected check-in meters directly from your mobile phone. Arrive on time.",
      colorClass: "bg-green-50 text-green-600 border border-green-105"
    },
    {
      icon: Mail,
      title: "Email Notifications",
      description: "Receive automated EmailJS verification receipts for registrations, schedules, and clinical status changes.",
      colorClass: "bg-purple-50 text-purple-600 border border-purple-105"
    },
    {
      icon: User,
      title: "Patient Dashboard",
      description: "Explore previous charts, book consultations, track dynamic queue progression, and manage prescriptions.",
      colorClass: "bg-amber-50 text-amber-600 border border-amber-105"
    },
    {
      icon: Activity,
      title: "Doctor Dashboard",
      description: "Control clinic lines, list check-in records, approve or cancel slots, and document completed patient files.",
      colorClass: "bg-rose-50 text-rose-600 border border-rose-105"
    },
    {
      icon: Shield,
      title: "Admin Control Center",
      description: "Conduct doctor registry creations, oversee appointment registries, manage clinic queues, and trace metrics.",
      colorClass: "bg-indigo-50 text-indigo-600 border border-indigo-105"
    }
  ];

  const departmentRooms = [
    {
      icon: Heart,
      title: "Cardiology",
      description: "Comprehensive diagnostic support for arrhythmias, heart failure, palpitations, and chronic blood pressure.",
      colorClass: "bg-red-50 text-red-600"
    },
    {
      icon: Activity,
      title: "Neurology",
      description: "Specialized assessment for migraine pathways, spinal tension, neural complications, and dizziness.",
      colorClass: "bg-pink-50 text-pink-650"
    },
    {
      icon: Bone,
      title: "Orthopedics",
      description: "Leading corrective solutions for joints, fractures, ligament wear, and muscular strength rehabilitation.",
      colorClass: "bg-amber-50 text-amber-600"
    },
    {
      icon: Sparkles,
      title: "Dermatology",
      description: "Esthetic treatments, skin biopsies, rash therapies, mole removals, and severe acne management.",
      colorClass: "bg-sky-50 text-sky-600"
    },
    {
      icon: Baby,
      title: "Pediatrics",
      description: "Caring child wellness clinics, periodic infant vaccinations, growth assessments, and kid therapies.",
      colorClass: "bg-emerald-50 text-emerald-600"
    },
    {
      icon: Stethoscope,
      title: "General Medicine",
      description: "Comprehensive wellness advice, fever management, flu support, and standard medical diagnostics.",
      colorClass: "bg-violet-50 text-violet-650"
    }
  ];

  const steps = [
    { num: "01", title: "Patient Register",        desc: "Create a free outpatient profile in under 2 minutes",  icon: UserPlus,    color: '#3b5bfc', bg: 'rgba(59,91,252,0.10)',  border: 'rgba(59,91,252,0.22)' },
    { num: "02", title: "Patient Login",           desc: "Securely sign in to access your clinical dashboard",   icon: LogIn,       color: '#0ea5e9', bg: 'rgba(14,165,233,0.10)', border: 'rgba(14,165,233,0.22)' },
    { num: "03", title: "Book Appointment",        desc: "Choose doctor, date, time slot and reason",            icon: Calendar,    color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.22)' },
    { num: "04", title: "Token Generated",         desc: "Instant unique SC-coded queue number issued",          icon: Ticket,      color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.22)' },
    { num: "05", title: "Email Confirmation",      desc: "Automated email receipt with appointment details",     icon: Mail,        color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.22)' },
    { num: "06", title: "Track Live Queue",        desc: "Monitor real-time queue progress from anywhere",      icon: Eye,         color: '#ec4899', bg: 'rgba(236,72,153,0.10)', border: 'rgba(236,72,153,0.22)' },
    { num: "07", title: "Visit Doctor",            desc: "Walk in precisely when your token is called",          icon: Stethoscope, color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.22)' },
  ];

  const testimonials = [
    {
      quote: "SmartCare literally changed how I see doctors. Instead of waiting for 2 hours in a highly congested hallway, I sat in a cafe across the street, tracked my queue live on my phone, and came in exactly when my token was called!",
      author: "Marcus Vance",
      title: "CHRONIC CARDIAC PATIENT",
      initials: "MV"
    },
    {
      quote: "With active scheduling and real-time email verification, I knew exactly when Dr. Meera had an open pediatric diagnostic slot. Managing children clinical checklists are no longer a chaotic task.",
      author: "Amanda Seyfried",
      title: "PEDIATRIC CARE PARENT",
      initials: "AS"
    },
    {
      quote: "Being able to easily trace active queue progress helps me budget my lunch break perfectly. The integration between doctor panels and modern client notification is seamless and top tier.",
      author: "James Chen",
      title: "ORTHOPEDIC OUTPATIENT",
      initials: "JC"
    }
  ];

  const faqs = [
    {
      q: "What is the token/queue number tracking feature?",
      a: "SmartCare issues a sequential clinical token (e.g., SC001) for each booked slot. Patients can track currently consulting token number live on their dashboard to bypass crowded clinic lobbies."
    },
    {
      q: "Can I reschedule my clinical booking online?",
      a: "Yes. Access your secure Patient Dashboard, locate your upcoming appointment card, and click Reschedule to select an alternative open slot immediately."
    },
    {
      q: "Is there an in-app helper to assist with symptoms?",
      a: "SmartCare includes a digital health helper and diagnostic room assignment model to direct patients toward correct clinical specialists based on symptom inputs."
    },
    {
      q: "How do clinical doctors progress the queue line?",
      a: "Doctors use their dedicated clinician panel to click 'Call Next Patient', which instantly increments the department token, triggering live notification updates across patient devices."
    }
  ];

  const handleBookDoctor = (doc) => {
    navigate(`/book-appointment?doctorId=${doc.id}`);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Please fill in Name, Email, and Message before submitting.');
      return;
    }
    toast.success('Your support inquiry has been submitted! Our clinical desk will reply shortly.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const handleBookDoctorGeneral = () => {
    navigate('/book-appointment');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between" id="sc-home-root">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection onBookClick={handleBookDoctorGeneral} />

      {/* Platform Capabilities (OUR SOLUTIONS / Features) */}
      <section className="py-20 bg-white border-t border-gray-100" id="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full uppercase tracking-wider font-display">
              Our Solutions
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-950 tracking-tight">
              Platform Capabilities
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-sans">
              We specialize in removing traditional medical friction. Book, track, and consult instantly inside a single system designed for premium institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => (
              <FeatureCard
                key={index}
                icon={feat.icon}
                title={feat.title}
                description={feat.description}
                colorClass={feat.colorClass}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Departments (EXPERTISE ROOMS) */}
      <section className="py-20 bg-[#FBFBFF] border-y border-gray-100" id="departments-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full uppercase tracking-wider font-display">
              Expertise Rooms
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-950 tracking-tight">
              Specialized Departments
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-sans">
              Locate specialized healthcare professionals for deep clinical investigation and personalized patient support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departmentRooms.map((dept, index) => {
              const DeptIcon = dept.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-xs hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 rounded-full ${dept.colorClass} flex items-center justify-center mb-4 shadow-xs`}>
                    <DeptIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-gray-950 mb-2">
                    {dept.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans font-medium font-semibold">
                    {dept.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Segment (TIMELINE) */}
      <section
        id="how-it-works-section"
        style={{ background: '#ffffff', padding: '5rem 0', borderTop: '1px solid rgba(15,23,42,0.06)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center mb-14">
            <span style={{
              display: 'inline-block',
              fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#3b5bfc',
              background: 'rgba(59,91,252,0.08)',
              border: '1px solid rgba(59,91,252,0.20)',
              padding: '4px 16px', borderRadius: 999,
              marginBottom: '1rem'
            }}>Timeline</span>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2,
              marginBottom: '0.75rem'
            }}>How It Works</h2>
            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 400, margin: '0 auto', lineHeight: 1.7 }}>
              A streamlined patient journey mapped directly into intuitive milestone actions.
            </p>
          </div>

          {/* Step Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            position: 'relative',
          }}>
            {steps.map((st, index) => {
              const StepIcon = st.icon;
              const isActive = activeStep === index;
              return (
                <motion.div
                  key={index}
                  id={`how-works-step-${index + 1}`}
                  onMouseEnter={() => setActiveStep(index)}
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${st.bg} 0%, #ffffff 100%)`
                      : '#ffffff',
                    border: `1.5px solid ${isActive ? st.border : 'rgba(15,23,42,0.08)'}`,
                    borderRadius: 20,
                    padding: '1.5rem',
                    cursor: 'default',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: isActive ? `0 8px 28px ${st.bg}` : '0 1px 4px rgba(0,0,0,0.05)',
                    transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
                  }}
                >
                  {/* Top: step number + icon */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    {/* Step badge */}
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: '0.14em',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: isActive ? '#fff' : '#64748b',
                      background: isActive ? st.color : 'rgba(15,23,42,0.06)',
                      border: `1px solid ${isActive ? st.color : 'rgba(15,23,42,0.08)'}`,
                      padding: '3px 10px', borderRadius: 999,
                    }}>
                      {st.num}
                    </span>

                    {/* Icon badge */}
                    <div style={{
                      width: 40, height: 40,
                      borderRadius: 12,
                      background: st.bg,
                      border: `1px solid ${st.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: st.color,
                      flexShrink: 0,
                      transition: 'transform 0.3s',
                      transform: isActive ? 'scale(1.12)' : 'scale(1)',
                    }}>
                      <StepIcon size={18} />
                    </div>
                  </div>

                  {/* Title */}
                  <h4 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 800, fontSize: 13,
                    color: '#0f172a',
                    lineHeight: 1.35,
                    marginBottom: '0.5rem',
                  }}>
                    {st.title}
                  </h4>

                  {/* Description */}
                  <p style={{
                    fontSize: 11, color: '#64748b',
                    lineHeight: 1.65,
                    margin: 0,
                  }}>
                    {st.desc}
                  </p>

                  {/* Bottom glow when active */}
                  {isActive && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: 2,
                      background: `linear-gradient(to right, transparent, ${st.color}, transparent)`,
                      borderRadius: '0 0 20px 20px',
                    }} />
                  )}
                </motion.div>
              );
            })}
          </div>


        </div>
      </section>

      {/* Active Team/Doctors Section */}
      <section className="py-20 bg-white border-t border-gray-100" id="doctors-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div className="text-center md:text-left space-y-2">
              <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-sm uppercase tracking-wider font-display">
                Clinical Experts
              </span>
              <h2 className="font-display font-bold text-3xl text-gray-950 tracking-tight">
                Our Panel of Medical Legends
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_DOCTORS.slice(0, 3).map((doc) => (
              <DoctorCard 
                key={doc.id}
                doctor={doc}
                onBookClick={handleBookDoctor}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Outpatient Testimonials Segment (PATIENT JOURNALS) */}
      <section className="py-20 bg-[#FBFBFF] border-t border-gray-100" id="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full uppercase tracking-wider font-display">
              Patient Journals
            </span>
            <h2 className="font-display font-bold text-3xl text-gray-950 tracking-tight">
              Outpatient Testimonials
            </h2>
          </div>

          {/* Carousel style interactive card */}
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-[28px] border border-gray-100 shadow-lg relative min-h-[220px]">
            <div className="space-y-6">
              {/* Star items */}
              <div className="flex gap-1 text-yellow-400 text-lg">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed italic font-sans font-medium">
                "{testimonials[activeTestimonial].quote}"
              </p>

              <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 font-bold flex items-center justify-center text-xs text-blue-600 font-display">
                    {testimonials[activeTestimonial].initials}
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-gray-900 leading-tight">
                      {testimonials[activeTestimonial].author}
                    </h5>
                    <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      {testimonials[activeTestimonial].title}
                    </span>
                  </div>
                </div>

                {/* Left and Right Chevron Controllers */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 transition-all text-xs font-bold cursor-pointer"
                  >
                    ⟨
                  </button>
                  <button
                    onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-550 hover:bg-gray-50 active:scale-95 transition-all text-xs font-bold cursor-pointer"
                  >
                    ⟩
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-white border-t border-gray-100" id="faqs-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full uppercase tracking-wider font-display">
              Information
            </span>
            <h2 className="font-display font-bold text-3xl text-gray-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto font-sans font-medium">
              Quick reference guidelines on managing and scheduling appointments at SmartCare.
            </p>
          </div>

          {/* FAQ Accordions */}
          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center outline-hidden cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-gray-900 font-sans">
                    {faq.q}
                  </span>
                  <span className="text-xs text-blue-600 font-bold ml-2">
                    {activeFAQ === idx ? '▲' : '▼'}
                  </span>
                </button>
                {activeFAQ === idx && (
                  <div className="px-6 pb-5 text-xs text-gray-400 font-medium font-sans leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Navy Contact Form Section (CONTACT SUPPORT INFORMATION) */}
      <section className="py-20 bg-[#111827] text-white" id="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch font-sans">
            
            {/* Left side: Contact Support Information card */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-slate-900/40 p-8 rounded-3xl border border-slate-800">
              <div className="space-y-6">
                <span className="inline-block text-[10px] font-bold text-blue-400 bg-blue-900/60 px-3 py-1 rounded-full uppercase tracking-wider font-display border border-blue-800/50">
                  Reach Out
                </span>
                <h3 className="font-display font-extrabold text-2xl tracking-tight text-white leading-tight">
                  Contact Support Information
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-sm font-medium font-semibold">
                  Have quick queries for clinical triage? Connect to our help desk and receive human directions instantly.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/10">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">DIRECT HOTLINE</p>
                    <p className="text-sm font-bold text-white mt-0.5">+91 63059 10456</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/10">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">EMAIL DESK</p>
                    <p className="text-sm font-bold text-white mt-0.5 font-semibold">support@smartcare.org</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/10">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">CLINIC COORDINATES</p>
                    <p className="text-sm font-bold text-white mt-0.5">100 Medical Plaza, Health Square, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Inquire Immediately form card */}
            <div className="lg:col-span-7 bg-white text-gray-900 p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-2xl space-y-6">
              <div>
                <h4 className="font-display font-extrabold text-xl text-gray-950 tracking-tight">
                  Inquire Immediately
                </h4>
                <p className="text-xs text-gray-400 mt-1 font-medium font-semibold font-sans">
                  Complete the inquiry card and we will contact you.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sen"
                      className="w-full text-xs p-3.5 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:outline-hidden rounded-xl bg-gray-50/55 font-medium"
                    />
                  </div>
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full text-xs p-3.5 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:outline-hidden rounded-xl bg-gray-50/55 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Topic / Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="e.g. Clinical operations info, triage guidance"
                    className="w-full text-xs p-3.5 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:outline-hidden rounded-xl bg-gray-50/55 font-medium"
                  />
                </div>

                <div className="space-y-1.5 font-sans">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Describe how we can assist you..."
                    className="w-full text-xs p-3.5 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:outline-hidden rounded-xl bg-gray-50/55 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all py-3.5 rounded-xl text-xs font-bold font-display cursor-pointer shadow-md shadow-blue-200"
                  id="sc-contact-submit-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Direct Inquiry
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>


      <ChatbotWidget />
    </div>
  );
}
