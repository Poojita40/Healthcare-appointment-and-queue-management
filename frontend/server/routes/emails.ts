import { Router } from 'express';
import { simulatedEmails } from '../state';

const router = Router();

// GET /api/simulated-emails
router.get('/', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.json(simulatedEmails);
  }
  const filtered = simulatedEmails.filter(
    item => item.to.toLowerCase() === (email as string).toLowerCase()
  );
  res.json(filtered);
});

export default router;
