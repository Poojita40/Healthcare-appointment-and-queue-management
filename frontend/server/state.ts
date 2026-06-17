import { GoogleGenAI } from '@google/genai';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// In-Memory Database State
export const users: any[] = [
  {
    id: 15,
    name: "Prashant Sen",
    email: "patient@smartcare.com",
    password: "password123",
    role: "PATIENT",
    phone: "9876500112",
    age: 29,
    gender: "Male",
    address: "Saket, New Delhi"
  },
  {
    id: 50,
    name: "Dr. Arvind Sharma",
    email: "doctor@smartcare.com",
    password: "password123",
    role: "DOCTOR",
    doctorId: 1,
    gender: "Male"
  },
  {
    id: 51,
    name: "Dr. Arvind Sharma",
    email: "arvind.sharma@smartcare.com",
    password: "password123",
    role: "DOCTOR",
    doctorId: 1,
    gender: "Male"
  },
  {
    id: 52,
    name: "Dr. Meera Nair",
    email: "meera.nair@smartcare.com",
    password: "password123",
    role: "DOCTOR",
    doctorId: 2,
    gender: "Female"
  },
  {
    id: 53,
    name: "Dr. Rajesh K.",
    email: "rajesh.k@smartcare.com",
    password: "password123",
    role: "DOCTOR",
    doctorId: 3,
    gender: "Male"
  },
  {
    id: 54,
    name: "Dr. Sarah D'Souza",
    email: "sarah.dsouza@smartcare.com",
    password: "password123",
    role: "DOCTOR",
    doctorId: 4,
    gender: "Female"
  },
  {
    id: 55,
    name: "Dr. Amit Verma",
    email: "amit.verma@smartcare.com",
    password: "password123",
    role: "DOCTOR",
    doctorId: 5,
    gender: "Male"
  },
  {
    id: 56,
    name: "Dr. Priya Patel",
    email: "priya.patel@smartcare.com",
    password: "password123",
    role: "DOCTOR",
    doctorId: 6,
    gender: "Female"
  },
  {
    id: 99,
    name: "System Admin Operations",
    email: "admin@smartcare.com",
    password: "password123",
    role: "ADMIN"
  }
];

export const doctors = [
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
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
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
    imageUrl: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=400"
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
    imageUrl: "https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=400"
  }
];

export const queues = [
  { doctorId: 1, currentToken: 4, nextToken: 7, estimatedWaitTime: 15, doctorName: "Dr. Arvind Sharma" },
  { doctorId: 2, currentToken: 0, nextToken: 1, estimatedWaitTime: 0, doctorName: "Dr. Meera Nair" },
  { doctorId: 3, currentToken: 0, nextToken: 1, estimatedWaitTime: 0, doctorName: "Dr. Rajesh K." },
  { doctorId: 4, currentToken: 0, nextToken: 1, estimatedWaitTime: 0, doctorName: "Dr. Sarah D'Souza" },
  { doctorId: 5, currentToken: 0, nextToken: 1, estimatedWaitTime: 0, doctorName: "Dr. Amit Verma" },
  { doctorId: 6, currentToken: 0, nextToken: 1, estimatedWaitTime: 0, doctorName: "Dr. Priya Patel" }
];

export const appointments = [
  {
    id: 101,
    patientId: 15,
    patientName: "Prashant Sen",
    doctorId: 1,
    doctorName: "Dr. Arvind Sharma",
    doctorSpecialization: "Cardiology",
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: "10:30",
    tokenNumber: 5,
    status: "PENDING",
    notes: "Requires standard post-cardiac analysis checkup.",
    createdAt: new Date()
  },
  {
    id: 102,
    patientId: 15,
    patientName: "Prashant Sen",
    doctorId: 1,
    doctorName: "Dr. Arvind Sharma",
    doctorSpecialization: "Cardiology",
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: "11:00",
    tokenNumber: 6,
    status: "PENDING",
    notes: "Checkups for occasional breathing struggles.",
    createdAt: new Date()
  }
];

export const simulatedEmails: any[] = [
  {
    id: 1,
    to: "patient@smartcare.com",
    subject: "Welcome to SmartCare Clinic",
    body: "Hello Prashant Sen,\n\nWelcome to SmartCare Clinic! Your patient profile has been registered successfully on our platform.\n\nYou can now log in to schedule real-time doctor consults, monitor live queue status, and retrieve your medical digital tokens instantly.\n\nBest Regards,\nSmartCare Medical Team",
    sentAt: new Date().toISOString(),
    type: "activation"
  }
];

// Helper to simulate sending an email
export function sendSimulatedEmail(to: string, subject: string, body: string, type: string) {
  const newEmail = {
    id: Math.floor(Math.random() * 900000) + 100000,
    to,
    subject,
    body,
    sentAt: new Date().toISOString(),
    type
  };
  simulatedEmails.push(newEmail);
  console.log(`\n==================================================\n[SIMULATED EMAIL DISPATCHED]\nTo: ${to}\nSubject: ${subject}\nBody:\n${body}\n==================================================\n`);
  return newEmail;
}
