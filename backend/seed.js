/**
 * Seed script — inserts dummy inspection_sessions for the "test" user.
 * Run once: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const LINE_IDS   = ['w4', 'buses'];
const STATUSES   = ['completed', 'completed', 'completed', 'skipped', 'failed'];
const SCREWDRIVERS = ['CLECO-01', 'CLECO-02', 'CLECO-03', 'CLECO-04'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function makeSteps(sessionStart) {
  const numSteps = rand(2, 6);
  const steps = [];
  let cursor = new Date(sessionStart);

  for (let i = 1; i <= numSteps; i++) {
    const stepStart = new Date(cursor);
    const durSecs   = rand(3, 30);
    const stepEnd   = new Date(stepStart.getTime() + durSecs * 1000);
    const status    = pick(STATUSES);
    const numScrews = status === 'completed' ? rand(0, 2) : 0;
    const screws    = Array.from({ length: numScrews }, () => pick(SCREWDRIVERS));

    steps.push({
      step:              i,
      started_at:        stepStart,
      finished_at:       stepEnd,
      status,
      screwdrivers_used: screws,
      failed_attempts:   status === 'failed' ? rand(1, 3) : 0,
    });

    // small gap between steps
    cursor = new Date(stepEnd.getTime() + rand(1, 5) * 1000);
  }
  return { steps, sessionEnd: cursor };
}

function randomPastDate(daysAgo) {
  const now  = Date.now();
  const past = now - daysAgo * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

// Build sessions spread over last 9 months at varied hours
// We want nice chart coverage: more sessions on weekdays, peaks at 9-11 am & 2-4 pm
function buildSessions(username, count = 120) {
  const sessions = [];

  for (let i = 0; i < count; i++) {
    // Weighted day: Mon–Thu more likely
    const dayWeights = [0.05, 0.20, 0.22, 0.22, 0.18, 0.10, 0.03]; // Sun–Sat
    let dayRoll = Math.random(), dayIdx = 0, acc = 0;
    for (let d = 0; d < 7; d++) { acc += dayWeights[d]; if (dayRoll < acc) { dayIdx = d; break; } }

    // Pick a random date within the last 9 months, then force the weekday
    const base     = randomPastDate(270);
    const diff     = (dayIdx - base.getDay() + 7) % 7;
    const target   = new Date(base.getTime() + diff * 86400000);

    // Weighted hour: peaks 8–11 and 13–16
    const hourWeights = [0,0,0,0,0,0,0.01,0.04,0.09,0.10,0.10,0.08,0.05,0.09,0.10,0.10,0.08,0.07,0.05,0.04,0.03,0.02,0.01,0];
    let hrRoll = Math.random(), hour = 0; acc = 0;
    for (let h = 0; h < 24; h++) { acc += hourWeights[h]; if (hrRoll < acc) { hour = h; break; } }

    target.setHours(hour, rand(0, 59), rand(0, 59), 0);

    const { steps, sessionEnd } = makeSteps(target);
    const allCompleted = steps.every(s => s.status === 'completed');
    const anyFailed    = steps.some(s => s.status === 'failed');
    const sessionStatus = allCompleted ? 'completed' : anyFailed ? 'failed' : 'skipped';

    sessions.push({
      session_id:  crypto.randomUUID(),
      username,
      line_id:     pick(LINE_IDS),
      started_at:  target,
      finished_at: sessionEnd,
      status:      sessionStatus,
      steps,
    });
  }
  return sessions;
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const col = db.collection('inspection_sessions');

    const username = process.argv[2] || 'test';
    const count    = parseInt(process.argv[3] || '120', 10);

    const sessions = buildSessions(username, count);
    const result   = await col.insertMany(sessions);
    console.log(`Inserted ${result.insertedCount} sessions for user "${username}"`);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
