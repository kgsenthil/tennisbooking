const SURFACE_COLORS = {
  Hard: '#3b82f6',
  Clay: '#f97316',
  Grass: '#22c55e',
};

export function CourtCard({ court, onSelect, selected }) {
  const color = SURFACE_COLORS[court.surface] ?? '#6b7280';
  return (
    <button
      onClick={() => onSelect(court)}
      className={`court-card ${selected ? 'court-card--selected' : ''}`}
      style={{ '--accent': color }}
    >
      <div className="court-card__badge">{court.surface}</div>
      <h3 className="court-card__name">{court.name}</h3>
      <p className="court-card__desc">{court.description}</p>
      <span className="court-card__tag">{court.indoor ? 'Indoor' : 'Outdoor'}</span>
    </button>
  );
}
