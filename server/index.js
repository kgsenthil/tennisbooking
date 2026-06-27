import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import courtsRouter from './routes/courts.js';
import bookingsRouter from './routes/bookings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

const app = express();

// Better Auth must be mounted before express.json() — it parses the body itself
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', process.env.RENDER_EXTERNAL_URL].filter(Boolean),
  credentials: true,
}));

app.use('/api/courts', courtsRouter);
app.use('/api/bookings', bookingsRouter);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// In production serve the Vite build; catch-all sends index.html for client routing
if (isProd) {
  const dist = path.join(__dirname, '../dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
