export const COURTS = [
  {
    id: 'court-1',
    name: 'Court 1 - Hardcourt',
    surface: 'Hard',
    indoor: false,
    image: null,
    description: 'Full-size outdoor hardcourt with floodlights.',
  },
  {
    id: 'court-2',
    name: 'Court 2 - Clay',
    surface: 'Clay',
    indoor: false,
    image: null,
    description: 'Classic red clay court, ideal for baseline play.',
  },
  {
    id: 'court-3',
    name: 'Court 3 - Indoor',
    surface: 'Hard',
    indoor: true,
    image: null,
    description: 'Heated indoor court available year-round.',
  },
  {
    id: 'court-4',
    name: 'Court 4 - Grass',
    surface: 'Grass',
    indoor: false,
    image: null,
    description: 'Natural grass court for the authentic Wimbledon feel.',
  },
];

// Generate 1-hour slots from 07:00 to 21:00
export const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 7;
  const start = `${String(hour).padStart(2, '0')}:00`;
  const end = `${String(hour + 1).padStart(2, '0')}:00`;
  return { id: `slot-${hour}`, label: `${start} – ${end}`, start, end };
});
