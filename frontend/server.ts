import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';

// Import our modularized backend routes
import authRouter from './server/routes/auth';
import doctorsRouter from './server/routes/doctors';
import patientsRouter from './server/routes/patients';
import appointmentsRouter from './server/routes/appointments';
import queuesRouter from './server/routes/queues';
import chatRouter from './server/routes/chat';
import emailsRouter from './server/routes/emails';

async function start() {
  const app = express();
  
  // Enable CORS for frontend running on Vercel or localhost
  app.use(cors());
  app.use(express.json());

  // Mount Backend API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/doctors', doctorsRouter);
  app.use('/api/patients', patientsRouter);
  app.use('/api/appointments', appointmentsRouter);
  app.use('/api/queue', queuesRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/simulated-emails', emailsRouter);

  // Use Vite middleware during development, otherwise static serving of dist/
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartCare fullstack listening on port ${PORT}`);
  });
}

start().catch(err => {
  console.error("Startup error", err);
});
