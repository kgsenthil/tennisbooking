import { useState, useEffect, useCallback } from 'react';

function normalize(b) {
  return {
    id: b.id,
    courtId: b.court_id,
    courtName: b.court_name,
    date: b.date,
    slotId: b.slot_id,
    slotLabel: b.slot_label,
    playerName: b.player_name,
    createdAt: b.created_at,
  };
}

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/bookings')
      .then(r => {
        if (!r.ok) throw new Error(`Server error ${r.status}`);
        return r.json();
      })
      .then(data => setBookings(data.map(normalize)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addBooking = useCallback(async ({ courtId, courtName, date, slotId, slotLabel, playerName }) => {
    const id = `${courtId}-${date}-${slotId}-${Date.now()}`;
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, courtId, courtName, date, slotId, slotLabel, playerName }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Booking failed (${res.status})`);
    }
    const booking = normalize(await res.json());
    setBookings(prev => [...prev, booking]);
    return booking;
  }, []);

  const cancelBooking = useCallback(async (id) => {
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Cancel failed (${res.status})`);
    setBookings(prev => prev.filter(b => b.id !== id));
  }, []);

  const isSlotBooked = useCallback(
    (courtId, date, slotId) => bookings.some(b => b.courtId === courtId && b.date === date && b.slotId === slotId),
    [bookings],
  );

  return { bookings, loading, error, addBooking, cancelBooking, isSlotBooked };
}
