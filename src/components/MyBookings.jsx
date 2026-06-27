export function MyBookings({ bookings, onCancel }) {
  const sorted = [...bookings].sort((a, b) => (a.date + a.slotId) > (b.date + b.slotId) ? 1 : -1);

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <p>You have no bookings yet. Pick a court and a time slot to get started!</p>
      </div>
    );
  }

  return (
    <ul className="bookings-list">
      {sorted.map(b => (
        <li key={b.id} className="booking-item">
          <div className="booking-item__info">
            <strong>{b.courtName}</strong>
            <span>{b.date} &bull; {b.slotLabel}</span>
            <span className="booking-item__player">{b.playerName}</span>
          </div>
          <button className="btn btn--danger" onClick={() => onCancel(b.id)}>Cancel</button>
        </li>
      ))}
    </ul>
  );
}
