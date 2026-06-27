import { Router } from 'express';
import { sql } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const bookings = await sql`
      SELECT * FROM bookings WHERE user_id = ${req.user.id} ORDER BY date, slot_id
    `;
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { id, courtId, courtName, date, slotId, slotLabel, playerName } = req.body;
  if (!id || !courtId || !date || !slotId || !playerName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const conflict = await sql`
      SELECT id FROM bookings
      WHERE court_id = ${courtId} AND date = ${date} AND slot_id = ${slotId}
    `;
    if (conflict.length > 0) {
      return res.status(409).json({ error: 'That slot is already booked' });
    }
    const [booking] = await sql`
      INSERT INTO bookings (id, court_id, court_name, date, slot_id, slot_label, player_name, user_id)
      VALUES (${id}, ${courtId}, ${courtName}, ${date}, ${slotId}, ${slotLabel}, ${playerName}, ${req.user.id})
      RETURNING *
    `;
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await sql`DELETE FROM bookings WHERE id = ${req.params.id} AND user_id = ${req.user.id}`;
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
