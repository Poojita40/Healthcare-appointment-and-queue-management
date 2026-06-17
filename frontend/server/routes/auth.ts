import { Router } from 'express';
import { users, sendSimulatedEmail } from '../state';

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { email, name, password, phone, age, gender, address } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ message: "Name, email, and password parameters are mandatory." });
  }
  const alreadyExists = users.some(u => u.email === email);
  if (alreadyExists) {
    return res.status(400).json({ message: "Profile under this email already exists." });
  }
  const newUser = {
    id: Math.floor(Math.random() * 1000) + 100,
    name,
    email,
    password,
    role: "PATIENT", // Only admin registers doctors; public is always patient
    phone: phone || "",
    age: age || null,
    gender: gender || "Male",
    address: address || ""
  };
  users.push(newUser);

  // Send simulated email
  sendSimulatedEmail(
    newUser.email,
    "Welcome to SmartCare Clinic",
    `Dear ${newUser.name},

Thank you for registering with SmartCare Clinic. Your patient account has been created successfully.

Profile Details:
- Name: ${newUser.name}
- Registered Email: ${newUser.email}
- Phone Number: ${newUser.phone || 'N/A'}
- Dedicated Patient ID: SC-PAT-${newUser.id}

You can now log in to book appointments, check estimated wait times, and track live queue tokens instantly from your dashboard.

Wishing you good health,
The SmartCare Clinical Operations Team`,
    "activation"
  );

  res.json(newUser);
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password parameters." });
  }
  // Simulate JWT token
  const token = `sc-token-${Math.random().toString(36).substring(2)}`;
  res.json({ token, user });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  res.json({ message: "Password reset request initiated successfully. Check support channels." });
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
  res.json({ message: "Password updated." });
});

export default router;
