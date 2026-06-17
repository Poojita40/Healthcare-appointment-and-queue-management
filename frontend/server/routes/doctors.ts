import { Router } from 'express';
import { doctors, queues, users } from '../state';

const router = Router();

// GET /api/doctors
router.get('/', (req, res) => {
  res.json(doctors);
});

// GET /api/doctors/:id
router.get('/:id', (req, res) => {
  const doc = doctors.find(d => d.id === parseInt(req.params.id, 10));
  if (!doc) return res.status(404).json({ message: "Doctor not found." });
  res.json(doc);
});

// POST /api/doctors
router.post('/', (req, res) => {
  const docData = req.body;
  const newDoc = {
    id: Math.floor(Math.random() * 1000) + 10,
    name: docData.name,
    specialization: docData.specialization,
    qualification: docData.qualification,
    experience: docData.experience,
    email: docData.email || `${docData.name.toLowerCase().replace(/\s+/g, '')}@smartcare.com`,
    phone: docData.phone || "9876543210",
    availability: docData.availability || "Mon-Fri (9:00 AM - 5:00 PM)",
    imageUrl: docData.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
  };
  doctors.push(newDoc);
  
  // Register related queue diagnostic block
  queues.push({
    doctorId: newDoc.id,
    currentToken: 0,
    nextToken: 1,
    estimatedWaitTime: 0,
    doctorName: newDoc.name
  });

  // Auto-create a doctor user login entry in our database
  users.push({
    id: Math.floor(Math.random() * 9000) + 1000,
    name: newDoc.name,
    email: newDoc.email,
    password: "password123", // standard evaluation password
    role: "DOCTOR",
    doctorId: newDoc.id,
    phone: newDoc.phone,
    age: 42,
    gender: "Male",
    address: "SmartCare Specialist Center"
  });

  res.json(newDoc);
});

// PUT /api/doctors/:id
router.put('/:id', (req, res) => {
  const docIdx = doctors.findIndex(d => d.id === parseInt(req.params.id, 10));
  if (docIdx === -1) return res.status(404).json({ message: "Doctor not found." });
  doctors[docIdx] = { ...doctors[docIdx], ...req.body };
  res.json(doctors[docIdx]);
});

// DELETE /api/doctors/:id
router.delete('/:id', (req, res) => {
  const idNum = parseInt(req.params.id, 10);
  const docIdx = doctors.findIndex(d => d.id === idNum);
  if (docIdx === -1) return res.status(404).json({ message: "Doctor not found." });
  const deleted = doctors.splice(docIdx, 1)[0];
  
  // Remove queue log
  const qIdx = queues.findIndex(q => q.doctorId === idNum);
  if (qIdx !== -1) queues.splice(qIdx, 1);

  res.json(deleted);
});

export default router;
