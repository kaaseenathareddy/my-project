// concurrent-seat-booking-simple.js
const express = require('express');
const app = express();
const PORT = 3000;

// --- 1. Data Structure for Seats ---
const SEAT_COUNT = 5;
const LOCK_TIMEOUT_MS = 60000; // 1 minute = 60000 ms

/*
 * Each seat looks like:
 * {
 *   status: 'available' | 'locked' | 'booked',
 *   lockedBy: string | null,
 *   lockExpiresAt: number (timestamp in ms)
 * }
 */
const seats = {};
for (let i = 1; i <= SEAT_COUNT; i++) {
  seats[i] = { status: 'available', lockedBy: null, lockExpiresAt: 0 };
}

let lockCounter = 1; // Unique lock IDs

// --- 2. Middleware: Clear expired locks before every request ---
function checkAndClearLocks(req, res, next) {
  const now = Date.now();
  for (const id in seats) {
    const seat = seats[id];
    if (seat.status === 'locked' && seat.lockExpiresAt < now) {
      console.log(`Lock expired for seat ${id}.`);
      seat.status = 'available';
      seat.lockedBy = null;
      seat.lockExpiresAt = 0;
    }
  }
  next();
}
app.use(checkAndClearLocks);

// Optional: background cleanup (in case no requests come in)
setInterval(() => {
  checkAndClearLocks({}, {}, () => {});
}, 5000);

// --- 3. Endpoints ---

// GET /seats: Show all seats
app.get('/seats', (req, res) => {
  const statusView = {};
  for (const id in seats) {
    statusView[id] = { status: seats[id].status };
  }
  res.status(200).json(statusView);
});

// POST /lock/:id: Lock a seat
app.post('/lock/:id', (req, res) => {
  const seatId = req.params.id;
  const seat = seats[seatId];

  if (!seat) {
    return res.status(404).json({ message: `Seat ${seatId} not found.` });
  }

  if (seat.status === 'booked') {
    return res.status(409).json({ message: `Seat ${seatId} is already booked.` });
  }

  if (seat.status === 'locked') {
    return res.status(409).json({ message: `Seat ${seatId} is currently locked. Try again later.` });
  }

  // Lock the seat
  const newLockId = lockCounter++;
  seat.status = 'locked';
  seat.lockedBy = newLockId.toString();
  seat.lockExpiresAt = Date.now() + LOCK_TIMEOUT_MS;

  console.log(
    `Seat ${seatId} locked by lock ID ${seat.lockedBy}. Expires at ${new Date(
      seat.lockExpiresAt
    ).toLocaleTimeString()}.`
  );

  res.status(200).json({
    message: `Seat ${seatId} locked successfully. Confirm within 1 minute.`,
    lockId: seat.lockedBy,
  });
});

// POST /confirm/:lockId: Confirm the booking
app.post('/confirm/:lockId', (req, res) => {
  const lockId = req.params.lockId;
  let confirmedSeatId = null;

  for (const id in seats) {
    const seat = seats[id];
    if (seat.lockedBy === lockId) {
      confirmedSeatId = id;

      if (seat.lockExpiresAt < Date.now()) {
        return res
          .status(400)
          .json({ message: `Lock for seat ${confirmedSeatId} has expired and cannot be booked.` });
      }

      // Confirm booking
      seat.status = 'booked';
      seat.lockedBy = null;
      seat.lockExpiresAt = 0;

      console.log(`Seat ${confirmedSeatId} booked successfully with lock ID ${lockId}.`);

      return res.status(200).json({ message: `Seat ${confirmedSeatId} booked successfully!` });
    }
  }

  return res.status(400).json({
    message: 'Seat is not locked with this ID and cannot be booked.',
  });
});

// --- 4. Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🎟 Seats: ${SEAT_COUNT}. ⏳ Lock Timeout: ${LOCK_TIMEOUT_MS / 1000} seconds.`);
});
