import { Router } from 'express';
import { users } from '../state';

const router = Router();

// GET /api/patients
router.get('/', (req, res) => {
  res.json(users.filter(u => u.role === 'PATIENT'));
});

// GET /api/patients/:id
router.get('/:id', (req, res) => {
  const patient = users.find(u => u.id === parseInt(req.params.id, 10) && u.role === 'PATIENT');
  if (!patient) return res.status(404).json({ message: "Patient not found." });
  res.json(patient);
});

// PUT /api/patients/:id
router.put('/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id, 10));
  if (idx === -1) return res.status(404).json({ message: "Patient not found." });
  users[idx] = { ...users[idx], ...req.body };
  res.json(users[idx]);
});

export default router;
