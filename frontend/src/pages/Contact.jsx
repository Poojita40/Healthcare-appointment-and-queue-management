import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Required fields are missing.');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/contact`, form);
      toast.success('Your support ticket has been registered. The admin team has been notified.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact submission error:', error);
      toast.error('Failed to submit inquiry. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="sc-contact-page"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0d1221' }}
    >
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: '2.5rem',
          alignItems: 'center',
        }}
          className="sc-contact-grid"
        >

          {/* ── LEFT: Info Panel ── */}
          <div style={{ color: '#fff' }}>
            {/* Badge */}
            <span style={{
              display: 'inline-block',
              border: '1px solid rgba(99,120,255,0.5)',
              color: '#7c8fff',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '4px 14px',
              borderRadius: '999px',
              marginBottom: '1.25rem',
            }}>
              Reach Out
            </span>

            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.25,
              marginBottom: '1rem',
              fontFamily: 'inherit',
            }}>
              Contact Support Information
            </h1>

            <p style={{
              fontSize: '13px',
              color: '#8899bb',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: '340px',
            }}>
              Have quick queries for clinical triage? Connect to our help desk
              and receive human directions instantly.
            </p>

            {/* Contact items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(99,120,255,0.12)',
                  border: '1px solid rgba(99,120,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Phone size={16} color="#7c8fff" />
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: '#566380', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Direct Hotline
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>
                    +91 63059 10456
                  </div>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(99,120,255,0.12)',
                  border: '1px solid rgba(99,120,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Mail size={16} color="#7c8fff" />
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: '#566380', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Email Desk
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>
                    support@smartcare.org
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'rgba(99,120,255,0.12)',
                  border: '1px solid rgba(99,120,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <MapPin size={16} color="#7c8fff" />
                </div>
                <div>
                  <div style={{ fontSize: '9px', color: '#566380', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Clinic Coordinates
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>
                    100 Medical Plaza, Health Square, NY 10001
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT: Form Card ── */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '2rem 2rem 1.75rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0d1221', marginBottom: '4px' }}>
                Inquire Immediately
              </h2>
              <p style={{ fontSize: '12px', color: '#8899bb' }}>
                Complete the inquiry card and we will contact you.
              </p>
            </div>

            {/* Name + Email row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', fontWeight: 700, color: '#8899bb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Sen"
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    fontSize: '12px',
                    color: '#0d1221',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                  id="contact-name"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', fontWeight: 700, color: '#8899bb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. rahul@example.com"
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    fontSize: '12px',
                    color: '#0d1221',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                  id="contact-email"
                />
              </div>
            </div>

            {/* Subject */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '9px', fontWeight: 700, color: '#8899bb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Topic / Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Clinical operations info, triage guidance"
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  fontSize: '12px',
                  color: '#0d1221',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                id="contact-subject"
              />
            </div>

            {/* Message */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '9px', fontWeight: 700, color: '#8899bb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Detailed Message
              </label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe how we can assist you..."
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  fontSize: '12px',
                  color: '#0d1221',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
                id="contact-message"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="contact-submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: loading ? '#94a3b8' : '#3b5bfc',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '13px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = '#2d4de0')}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = '#3b5bfc')}
            >
              <Send size={15} />
              {loading ? 'Sending Inquiry...' : 'Submit Direct Inquiry'}
            </button>
          </form>

        </div>
      </main>

      {/* Responsive stacking on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .sc-contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
