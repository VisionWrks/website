const router   = require('express').Router();
const passport = require('passport');
const User     = require('../models/User');

const FRONTEND = process.env.FRONTEND_URL || '';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated.' });
}

// ─── Email / Password Signup ─────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email already registered.' });

    const user = await User.create({ name, email, password });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Session error after signup.' });
      res.status(201).json({ user: user.toSafeObject() });
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ─── Email / Password Login ───────────────────────────────────────────────────
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ error: 'Server error.' });
    if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials.' });

    req.login(user, (loginErr) => {
      if (loginErr) return res.status(500).json({ error: 'Session error.' });
      res.json({ user: user.toSafeObject() });
    });
  })(req, res, next);
});

// ─── Google OAuth ─────────────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND}/auth.html?error=google` }),
  (req, res) => res.redirect(`${FRONTEND}/auth.html?success=1`)
);

// ─── Apple Sign In ────────────────────────────────────────────────────────────
// Apple redirects back via POST
router.get('/apple',
  passport.authenticate('apple')
);

router.post('/apple/callback',
  passport.authenticate('apple', { failureRedirect: `${FRONTEND}/auth.html?error=apple` }),
  (req, res) => res.redirect(`${FRONTEND}/auth.html?success=1`)
);

// ─── Logout ───────────────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed.' });
    res.json({ message: 'Logged out.' });
  });
});

// ─── Current User ─────────────────────────────────────────────────────────────
router.get('/me', isAuthenticated, (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

module.exports = router;
