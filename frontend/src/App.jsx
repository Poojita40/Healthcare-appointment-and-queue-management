import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import AppointmentHistory from './pages/AppointmentHistory';
import QueueTracking from './pages/QueueTracking';
import Profile from './pages/Profile';

// Guard wrapper to protect pages based on login status and role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-bold font-display">Authorizing session credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to home or standard dashboard depending on user role
    if (user?.role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
    if (user?.role === 'DOCTOR') return <Navigate to="/doctor-dashboard" replace />;
    return <Navigate to="/patient-dashboard" replace />;
  }

  return children;
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Mobile Sidebar Drawer */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-slate-950 text-slate-400 border-r border-slate-800 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} id="mobile-sidebar">
          <Sidebar />
        </div>
        {/* Desktop Sidebar */}
        <div className="hidden">
          <Sidebar />
        </div>
        <Routes>
          {/* Public Landing Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Patient Guarded Pages */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <PatientDashboard onMenuClick={toggleSidebar} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <BookAppointment onMenuClick={toggleSidebar} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointment-history"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <AppointmentHistory onMenuClick={toggleSidebar} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue-tracking"
            element={
              <ProtectedRoute allowedRoles={['PATIENT']}>
                <QueueTracking onMenuClick={toggleSidebar} />
              </ProtectedRoute>
            }
          />

          {/* Doctor Guarded Pages */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['DOCTOR']}>
                <DoctorDashboard onMenuClick={toggleSidebar} />
              </ProtectedRoute>
            }
          />

          {/* Admin Guarded Pages */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard onMenuClick={toggleSidebar} />
              </ProtectedRoute>
            }
          />

          {/* Shared Guarded Pages (Profile belongs to anyone logged in) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile onMenuClick={toggleSidebar} />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      {/* Toast provider container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            borderRadius: '12px',
            background: '#0c4a6e',
            color: '#fff',
            fontWeight: '600'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#fff'
            }
          }
        }}
      />
    </AuthProvider>
  );
}
