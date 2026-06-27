import { useState } from 'react';

export function BookingModal({ court, date, slot, onConfirm, onClose }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    onConfirm(name.trim());
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Confirm Booking</h2>
        <table className="modal__table">
          <tbody>
            <tr><th>Court</th><td>{court.name}</td></tr>
            <tr><th>Date</th><td>{date}</td></tr>
            <tr><th>Time</th><td>{slot.label}</td></tr>
          </tbody>
        </table>
        <form onSubmit={handleSubmit}>
          <label className="modal__label">
            Your name
            <input
              className="modal__input"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Jane Smith"
              autoFocus
            />
          </label>
          {error && <p className="modal__error">{error}</p>}
          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">Book Now</button>
          </div>
        </form>
      </div>
    </div>
  );
}
