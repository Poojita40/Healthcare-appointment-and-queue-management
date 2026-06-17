import { Router } from 'express';
import { queues, appointments } from '../state';

const router = Router();

// GET /api/queue
router.get('/', (req, res) => {
  res.json(queues);
});

// PUT /api/queue/next
router.put('/next', (req, res) => {
  const { doctorId } = req.body;
  const qObj = queues.find(q => q.doctorId === parseInt(doctorId, 10));
  if (!qObj) return res.status(404).json({ message: "Doctor queue not found." });

  // Look for lowest pending token appointment
  const nextPending = appointments
    .filter(a => a.doctorId === parseInt(doctorId, 10) && a.status === 'PENDING')
    .sort((a, b) => a.tokenNumber - b.tokenNumber)[0];

  if (nextPending) {
    nextPending.status = "CONFIRMED";
    qObj.currentToken = nextPending.tokenNumber;
  } else {
    qObj.currentToken = qObj.nextToken - 1; // standard sync up
  }
  res.json(qObj);
});

// PUT /api/queue/complete
router.put('/complete', (req, res) => {
  const { doctorId, tokenNumber } = req.body;
  const appt = appointments.find(a => a.doctorId === parseInt(doctorId, 10) && a.tokenNumber === parseInt(tokenNumber, 10) && a.status === 'CONFIRMED');
  if (appt) {
    appt.status = "COMPLETED";
  }
  res.json({ message: "Consult complete" });
});

// PUT /api/queue/skip
router.put('/skip', (req, res) => {
  const { doctorId, tokenNumber } = req.body;
  const appt = appointments.find(a => a.doctorId === parseInt(doctorId, 10) && a.tokenNumber === parseInt(tokenNumber, 10) && a.status === 'CONFIRMED');
  if (appt) {
    appt.status = "SKIPPED";
  }
  res.json({ message: "Consult skipped" });
});

export default router;
