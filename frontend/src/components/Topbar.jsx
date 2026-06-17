import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, ShieldAlert, BadgeCheck, Phone, Mail, X, RefreshCw, Calendar, CheckCircle2, AlertOctagon, Menu } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { emailService } from '../services/emailService';
import QueueTrackingCard from './QueueTrackingCard';

export default function Topbar({ title = 'Dashboard Overview', onMenuClick }) {
  const { user } = useAuth();
  const [emails, setEmails] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const responseData = await emailService.getSimulatedEmails(user.email);
      const data = Array.isArray(responseData) ? responseData : [];
      // Sort emails descendending by sentAt (latest first)
      const sorted = [...data].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
      setEmails(sorted);
    } catch (err) {
      console.error('Error fetching simulated inbox:', err);
    } finally {
      setLoading(false);
    }
  };

  // Poll for simulated emails when menu is active or on mount so bookings show up immediately
  useEffect(() => {
    if (user?.email) {
      fetchEmails();
      const interval = setInterval(fetchEmails, 6000);
      return () => clearInterval(interval);
    }
  }, [user?.email]);

  const handleOpenInbox = () => {
    fetchEmails();
    setIsOpen(true);
    setSelectedEmail(null);
  };

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 shrink-0 relative" id="sc-dashboard-topbar">
      {/* Mobile menu button */}
      <button onClick={onMenuClick} className="p-2 rounded-md hover:bg-slate-100 focus:outline-none">
        <Menu className="w-5 h-5 text-slate-600" />
      </button>

      {/* Title */}
      <div className="flex-1 text-center lg:text-left">
        <h2 className="font-display font-bold text-lg text-gray-900 leading-tight">
          {title}
        </h2>
        <p className="text-[10px] text-gray-400 font-medium tracking-wide">
          {formatDate(new Date())}
        </p>
      </div>

      {/* Control panel containing contacts & simulated email inbox */}
      <div className="flex items-center gap-4">
        {/* Urgent Contact notice */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-100/30 font-medium px-3 py-1.5 rounded-full">
          <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" />
          Emergency? Call 108
        </div>

        {/* Live Simulated Patient Email Inbox */}
        {user && (
          <div className="relative">
            <button
              onClick={handleOpenInbox}
              className="relative p-2 text-slate-500 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 rounded-xl transition-all cursor-pointer border border-slate-100 flex items-center justify-center"
              title="Patient Simulated Mailbox"
            >
              <Mail className="w-5 h-5" />
              {emails.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-mono font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-xs ring-2 ring-white">
                  {emails.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* User Badge */}
        {user && (
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-gray-800 font-display block leading-none">
                {user.name}
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-500 font-semibold px-1.5 py-0.5 rounded-sm tracking-wider uppercase inline-block mt-1">
                {user.role} Member
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 border border-sky-100/50 flex items-center justify-center font-bold text-sm select-none">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
          </div>
        )}
      </div>

      {/* Sliding Email Inbox Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-[999]" id="sc-simulated-mailbox">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slideIn">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-sky-600 text-white">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <div>
                  <h3 className="font-display font-bold text-sm">SmartCare Virtual Email Inbox</h3>
                  <p className="text-[10px] text-sky-150">Simulating live emails delivered to: <strong className="underline">{user?.email}</strong></p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={fetchEmails} 
                  className="p-1 rounded-md hover:bg-white/10 text-white transition-all cursor-pointer"
                  title="Force Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1 rounded-md hover:bg-white/10 text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Inbox Core split view list or message reader */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
              
              {selectedEmail ? (
                /* Email detailed reader block */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 animate-fadeIn">
                  <button 
                    onClick={() => setSelectedEmail(null)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100/30"
                  >
                    ← Back to simulated emails list
                  </button>

                  <div className="border-b border-slate-100 pb-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider font-mono">
                        {selectedEmail.type.toUpperCase()} NOTIFICATION
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {new Date(selectedEmail.sentAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <h4 className="font-display font-extrabold text-base text-gray-950 leading-snug">
                      {selectedEmail.subject}
                    </h4>
                    <div className="text-[11px] text-gray-500 font-mono">
                      <p><strong>From:</strong> SmartCare Clinical Delivery &lt;no-reply@smartcare.com&gt;</p>
                      <p><strong>To:</strong> {selectedEmail.to}</p>
                    </div>
                  </div>

                  {/* Email body containing real Token and live Estimated Wait time */}
                  <div className="whitespace-pre-line text-xs text-gray-700 font-sans leading-relaxed bg-slate-50/50 border border-slate-100 p-4 rounded-xl">
                    {selectedEmail.body}
                  </div>

                  {/* Real-time Embedded Queue Tracking Card for Booking, Reschedule, Cancellation, etc. */}
                  {['booking', 'cancellation', 'reschedule'].includes(selectedEmail.type) && (() => {
                    const parsed = (() => {
                      const email = selectedEmail;
                      // Extract token formatting (e.g. SC006)
                      const tokenMatch = email.subject?.match(/\[Token:\s*(SC\d+)\]/i) || email.body?.match(/Token Number:\s*(SC\d+)/i) || email.body?.match(/YOUR APPOINTMENT TOKEN\D*(SC\d+)/i);
                      const rawTokenNumMatch = email.body?.match(/Digital Code:\s*(\d+)/i) || email.body?.match(/Released Token Number:\s*SC(\d+)/i) || email.body?.match(/Token Number:\s*SC(\d+)/i);
                      
                      let tokenNumber = null;
                      if (rawTokenNumMatch) {
                        tokenNumber = parseInt(rawTokenNumMatch[1], 10);
                      } else if (tokenMatch) {
                        tokenNumber = parseInt(tokenMatch[1].replace(/SC/i, ''), 10);
                      }

                      let doctorName = null;
                      const docSubjectMatch = email.subject?.match(/(?:Confirmation|Cancelled|Rescheduled|Reschedule|Appointment):\s*([^[\]\n]+?)(?:\s*\[Token:|$)/i);
                      const docBodyMatch = email.body?.match(/(?:-\s*Doctor:\s*|with\s*)([^\n(]+)/i);
                      
                      if (docSubjectMatch && docSubjectMatch[1]) {
                        doctorName = docSubjectMatch[1].replace(/Appointment/i, '').replace(/Confirmation/i, '').replace(/Cancelled/i, '').trim();
                      } else if (docBodyMatch && docBodyMatch[1]) {
                        doctorName = docBodyMatch[1].trim();
                      }

                      let status = 'PENDING';
                      if (email.type === 'cancellation') status = 'CANCELLED';
                      else if (email.type === 'reschedule') status = 'RESCHEDULED';

                      return { tokenNumber, doctorName, status };
                    })();

                    return parsed.tokenNumber ? (
                      <div className="pt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-display">
                          Instant Mail Tracking Card
                        </p>
                        <QueueTrackingCard
                          yourTokenNumber={parsed.tokenNumber}
                          doctorName={parsed.doctorName}
                          status={parsed.status}
                          compact={true}
                        />
                      </div>
                    ) : null;
                  })()}

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>Message Id: {selectedEmail.id}</span>
                    <span>Status: Delivered (Sandbox)</span>
                  </div>
                </div>
              ) : (
                /* Email list mapping */
                <div className="space-y-3">
                  {emails.length === 0 ? (
                    <div className="text-center py-16 px-6 bg-white border border-dashed border-slate-200 rounded-3xl space-y-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-950 text-xs">No Simulated Emails</h4>
                        <p className="text-[10px] text-gray-400 max-w-sm mx-auto mt-1 leading-relaxed">
                          Once you register accounts, book consultations, or cancel appointments, real-time emails containing live <strong>Tokens</strong> and computed <strong>Estimated Times</strong> will appear here instantly!
                        </p>
                      </div>
                    </div>
                  ) : (
                    emails.map((email) => {
                      const isBooking = email.type === 'booking';
                      const isCancel = email.type === 'cancellation';
                      return (
                        <div
                          key={email.id}
                          onClick={() => setSelectedEmail(email)}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex gap-3 items-start relative overflow-hidden group select-none"
                        >
                          <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                            isBooking ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            isCancel ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {isBooking ? <CheckCircle2 className="w-4 h-4" /> :
                             isCancel ? <AlertOctagon className="w-4 h-4" /> :
                             <Calendar className="w-4 h-4" />}
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[9px] font-extrabold text-blue-750 uppercase tracking-widest bg-blue-50/50 px-1.5 py-0.5 rounded-sm">
                                {email.type}
                              </span>
                              <span className="text-[9px] text-gray-400 font-mono">
                                {new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <h4 className="font-semibold text-xs text-gray-950 font-display group-hover:text-sky-600 transition-colors leading-tight truncate">
                              {email.subject}
                            </h4>
                            <p className="text-[10px] text-gray-400 line-clamp-2 leading-normal">
                              {email.body}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

            </div>

            {/* Footer with Sandbox status indicator */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[9px] text-gray-400 tracking-wider uppercase font-mono">
              ● Simulated SMTP Server Active &bull; Offline Sandbox Environment
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
