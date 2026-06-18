export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const USER_ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN'
};

export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  SKIPPED: 'SKIPPED'
};

export const SPECIALTIES = [
  'General Physician',
  'Cardiology',
  'Pediatrics',
  'Dermatology',
  'Orthopedics',
  'Neurology',
  'Gynecology'
];

export const INITIAL_DOCTORS = [
  {
    id: 1,
    name: "Dr. Arvind Sharma",
    specialization: "Cardiology",
    qualification: "MD, DM (Cardiology) - AIIMS",
    experience: "15 Years",
    email: "arvind.sharma@smartcare.com",
    phone: "9876543210",
    availability: "Mon, Wed, Fri (9:00 AM - 1:00 PM)",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    name: "Dr. Meera Nair",
    specialization: "Pediatrics",
    qualification: "MBBS, DCH, MD (Pediatrics)",
    experience: "12 Years",
    email: "meera.nair@smartcare.com",
    phone: "9876543211",
    availability: "Tue, Thu, Sat (10:00 AM - 3:00 PM)",
    imageUrl: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    name: "Dr. Rajesh K.",
    specialization: "Orthopedics",
    qualification: "MS (Orthopedics), M.Ch (Joint Replacement)",
    experience: "18 Years",
    email: "rajesh.k@smartcare.com",
    phone: "9876543212",
    availability: "Mon to Fri (2:00 PM - 6:00 PM)",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 4,
    name: "Dr. Sarah D'Souza",
    specialization: "Dermatology",
    qualification: "MD, DNB (Dermatology)",
    experience: "9 Years",
    email: "sarah.dsouza@smartcare.com",
    phone: "9876543213",
    availability: "Wed, Thu, Sat (4:00 PM - 8:00 PM)",
    imageUrl: "https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 5,
    name: "Dr. Amit Verma",
    specialization: "General Physician",
    qualification: "MD (Medicine)",
    experience: "14 Years",
    email: "amit.verma@smartcare.com",
    phone: "9876543214",
    availability: "Mon to Sat (9:00 AM - 5:00 PM)",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 6,
    name: "Dr. Priya Patel",
    specialization: "Neurology",
    qualification: "MD, DM (Neurology)",
    experience: "11 Years",
    email: "priya.patel@smartcare.com",
    phone: "9876543215",
    availability: "Tue, Fri (1:00 PM - 5:00 PM)",
    imageUrl: "https://images.unsplash.com/photo-1614608682850-e0e6edc961dc?auto=format&fit=crop&q=80&w=400"
  }
];
