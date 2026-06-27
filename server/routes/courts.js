import { Router } from 'express';
import { sql } from '../db.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const courts = await sql`SELECT * FROM courts ORDER BY id`;
    res.json(courts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
