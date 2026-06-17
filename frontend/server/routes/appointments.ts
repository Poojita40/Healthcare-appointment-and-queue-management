import { Router } from 'express';
import { appointments, users, doctors, queues, sendSimulatedEmail } from '../state';

const router = Router();

// GET /api/appointments
router.get('/', (req, res) => {
  const { patientId, doctorId } = req.query;
  let filtered = [...appointments];
  if (patientId) {
    filtered = filtered.filter(a => a.patientId === parseInt(patientId as string, 10));
  }
  if (doctorId) {
    filtered = filtered.filter(a => a.doctorId === parseInt(doctorId as string, 10));
  }
  res.json(filtered);
});

// POST /api/appointments
router.post('/', (req, res) => {
  const { patientId, doctorId, appointmentDate, appointmentTime, notes } = req.body;
  if (!patientId || !doctorId) {
    return res.status(400).json({ message: "patientId and doctorId parameters are required." });
  }

  const patient = users.find(u => u.id === parseInt(patientId, 10));
  const doctorObj = doctors.find(d => d.id === parseInt(doctorId, 10));
  
  if (!doctorObj) {
    return res.status(404).json({ message: "Doctor not found." });
  }

  // Advance queue token
  const queueObj = queues.find(q => q.doctorId === parseInt(doctorId, 10));
  let assignedToken = 1;
  if (queueObj) {
    assignedToken = queueObj.nextToken;
    queueObj.nextToken += 1;
  }

  const newAppt = {
    id: Math.floor(Math.random() * 10000) + 1000,
    patientId: parseInt(patientId, 10),
    patientName: patient ? patient.name : 'Unknown Patient',
    doctorId: parseInt(doctorId, 10),
    doctorName: doctorObj.name,
    doctorSpecialization: doctorObj.specialization,
    appointmentDate: appointmentDate || new Date().toISOString().split('T')[0],
    appointmentTime: appointmentTime || "10:00",
    tokenNumber: assignedToken,
    status: "PENDING",
    notes: notes || "",
    createdAt: new Date()
  };

  appointments.push(newAppt);

  // Compute live estimated wait time details for email
  const currentTokenVal = queueObj ? queueObj.currentToken : 0;
  const patientsAhead = Math.max(0, assignedToken - currentTokenVal - 1);
  const waitTimeMinutes = patientsAhead * 15;
  const waitTimeText = waitTimeMinutes === 0 
    ? "Immediate (You are next in queue!)" 
    : `${waitTimeMinutes} mins (${patientsAhead} patients ahead of you)`;
  const formattedToken = `SC${String(assignedToken).padStart(3, '0')}`;

  const patientEmail = patient ? patient.email : "patient@smartcare.com";
  const patientName = patient ? patient.name : "Valued Patient";

  // Send Booking Confirmation Email
  sendSimulatedEmail(
    patientEmail,
    `SmartCare Appointment Confirmation: ${doctorObj.name} [Token: ${formattedToken}]`,
    `Dear ${patientName},

Your booking at SmartCare Hospital has been successfully confirmed. Please review your appointment details and live queue status information below:

Appointment Details:
- Doctor: ${doctorObj.name} (${doctorObj.specialization})
- Date: ${newAppt.appointmentDate}
- Preferred Time Slot: ${newAppt.appointmentTime}
- Consult Fee: Balanced by standard policy / insurance
- Appointment ID: SC-APT-${newAppt.id}

QUEUE TRACKING DETAILS:
- Your Assigned Token Number: ${formattedToken} (Digital Code: ${assignedToken})
- Patients Ahead of You: ${patientsAhead}
- Estimated Wait Time: ${waitTimeText}

Important Instructions:
1. Please arrive at the hospital Clinic Desk at least 10 minutes prior to your preferred slot.
2. Open the SmartCare mobile app to track your live queue progress in real-time. We will call your token number on the overhead display screens.
3. If you need to reschedule or cancel, please do so via the patient portal.

Thank you for choosing SmartCare for your healthcare requirements!

Warm Regards,
SmartCare Clinic Desk & Scheduling Operations`,
    "booking"
  );

  res.json(newAppt);
});

// PUT /api/appointments/:id
router.put('/:id', (req, res) => {
  const idx = appointments.findIndex(a => a.id === parseInt(req.params.id, 10));
  if (idx === -1) return res.status(404).json({ message: "Appointment not found." });
  appointments[idx] = { ...appointments[idx], ...req.body };
  res.json(appointments[idx]);
});

// DELETE /api/appointments/:id
router.delete('/:id', (req, res) => {
  const idx = appointments.findIndex(a => a.id === parseInt(req.params.id, 10));
  if (idx === -1) return res.status(404).json({ message: "Appointment not found." });
  const deleted = appointments.splice(idx, 1)[0];

  // Identify patient's email to send the cancellation receipt
  const patient = users.find(u => u.id === deleted.patientId);
  const patientEmail = patient ? patient.email : "patient@smartcare.com";
  const patientName = patient ? patient.name : "Valued Patient";
  const formattedToken = `SC${String(deleted.tokenNumber).padStart(3, '0')}`;

  // Send Cancellation Receipt Email
  sendSimulatedEmail(
    patientEmail,
    `Appointment Cancelled: ${deleted.doctorName} [Token: ${formattedToken}]`,
    `Dear ${patientName},

This is to confirm that your scheduled appointment at SmartCare Hospital has been successfully cancelled as per your request.

Cancelled Appointment Details:
- Doctor: ${deleted.doctorName} (${deleted.doctorSpecialization})
- Scheduled Date: ${deleted.appointmentDate}
- Scheduled Time Slot: ${deleted.appointmentTime}
- Released Token Number: ${formattedToken}
- Reference ID: SC-APT-${deleted.id}

Any pre-authorized tokens for this specific calendar slot have been released and returned to the master queue list. 

If this cancellation was done in error, or if you would like to schedule a new appointment with another clinician, please visit the patient dashboard or contact patient services.

Best Regards,
SmartCare Clinic Desk & Scheduling Operations`,
    "cancellation"
  );

  res.json(deleted);
});

export default router;
