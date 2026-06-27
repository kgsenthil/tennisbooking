import { TIME_SLOTS } from '../data/courts';

export function SlotGrid({ courtId, date, isSlotBooked, onBook }) {
  return (
    <div className="slot-grid">
      {TIME_SLOTS.map(slot => {
        const booked = isSlotBooked(courtId, date, slot.id);
        return (
          <button
            key={slot.id}
            className={`slot ${booked ? 'slot--booked' : 'slot--free'}`}
            disabled={booked}
            onClick={() => !booked && onBook(slot)}
          >
            {slot.label}
            <span className="slot__status">{booked ? 'Booked' : 'Available'}</span>
          </button>
        );
      })}
    </div>
  );
}
