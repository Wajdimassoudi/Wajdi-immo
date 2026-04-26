import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './src/backend/routes/auth';
import { listingRouter } from './src/backend/routes/listings';
import { locationRouter } from './src/backend/routes/locations';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security & Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for Vite dev
  }));
  app.use(compression());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.use('/api/listings', listingRouter);
  app.use('/api/locations', locationRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
