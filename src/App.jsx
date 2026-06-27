import { useState } from 'react';
import { COURTS } from './data/courts';
import { useBookings } from './hooks/useBookings';
import { useSession, signOut } from './lib/authClient';
import { CourtCard } from './components/CourtCard';
import { SlotGrid } from './components/SlotGrid';
import { BookingModal } from './components/BookingModal';
import { MyBookings } from './components/MyBookings';
import { AuthPage } from './components/AuthPage';
import './App.css';

const today = new Date().toISOString().slice(0, 10);

export default function App() {
  const { data: session, isPending: sessionLoading } = useSession();

  if (sessionLoading) {
    return (
      <div className="app">
        <div className="loading full-page-loading">Checking session…</div>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return <BookingApp session={session} />;
}

function BookingApp({ session }) {
  const [tab, setTab] = useState('book');
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [date, setDate] = useState(today);
  const [pendingSlot, setPendingSlot] = useState(null);
  const [toast, setToast] = useState(null);

  const { bookings, loading, error, addBooking, cancelBooking, isSlotBooked } = useBookings();

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSignOut() {
    await signOut();
  }

  async function handleConfirmBooking(playerName) {
    try {
      await addBooking({
        courtId: selectedCourt.id,
        courtName: selectedCourt.name,
        date,
        slotId: pendingSlot.id,
        slotLabel: pendingSlot.label,
        playerName,
      });
      setPendingSlot(null);
      showToast(`Court booked for ${playerName}!`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleCancel(id) {
    try {
      await cancelBooking(id);
      showToast('Booking cancelled.', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <span className="header__icon">🎾</span>
            <span className="header__title">TennisBook</span>
          </div>
          <nav className="header__nav">
            <button
              className={`nav-btn ${tab === 'book' ? 'nav-btn--active' : ''}`}
              onClick={() => setTab('book')}
            >
              Book a Court
            </button>
            <button
              className={`nav-btn ${tab === 'mybookings' ? 'nav-btn--active' : ''}`}
              onClick={() => setTab('mybookings')}
            >
              My Bookings
              {bookings.length > 0 && (
                <span className="badge">{bookings.length}</span>
              )}
            </button>
            <div className="header__user">
              <span className="header__user-name">{session.user.name}</span>
              <button className="nav-btn nav-btn--signout" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="main">
        {error && (
          <div className="error-banner">
            Could not connect to the server: {error}
          </div>
        )}

        {tab === 'book' && (
          <>
            <section className="section">
              <h2 className="section__title">Select a Court</h2>
              <div className="courts-grid">
                {COURTS.map(court => (
                  <CourtCard
                    key={court.id}
                    court={court}
                    selected={selectedCourt?.id === court.id}
                    onSelect={setSelectedCourt}
                  />
                ))}
              </div>
            </section>

            {selectedCourt && (
              <section className="section">
                <div className="section__header">
                  <h2 className="section__title">Available Slots — {selectedCourt.name}</h2>
                  <input
                    type="date"
                    className="date-picker"
                    value={date}
                    min={today}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
                {loading ? (
                  <div className="loading">Loading slots…</div>
                ) : (
                  <SlotGrid
                    courtId={selectedCourt.id}
                    date={date}
                    isSlotBooked={isSlotBooked}
                    onBook={setPendingSlot}
                  />
                )}
              </section>
            )}

            {!selectedCourt && (
              <p className="hint">Select a court above to see available time slots.</p>
            )}
          </>
        )}

        {tab === 'mybookings' && (
          <section className="section">
            <h2 className="section__title">My Bookings</h2>
            {loading ? (
              <div className="loading">Loading bookings…</div>
            ) : (
              <MyBookings bookings={bookings} onCancel={handleCancel} />
            )}
          </section>
        )}
      </main>

      {pendingSlot && selectedCourt && (
        <BookingModal
          court={selectedCourt}
          date={date}
          slot={pendingSlot}
          onConfirm={handleConfirmBooking}
          onClose={() => setPendingSlot(null)}
        />
      )}

      {toast && (
        <div className={`toast toast--${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
