const router   = require('express').Router();
const mongoose = require('mongoose');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated.' });
}

// GET /api/inspections — return all inspection sessions for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const sessions = await db
      .collection('inspection_sessions')
      .find({ username: req.user.name })
      .sort({ started_at: -1 })
      .toArray();
    res.json({ sessions });
  } catch (err) {
    console.error('Inspections fetch error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
