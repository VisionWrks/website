require('dotenv').config();

const express    = require('express');
const path       = require('path');
const session    = require('express-session');
const MongoStore = require('connect-mongo');
const passport   = require('passport');
const cors       = require('cors');
const mongoose   = require('mongoose');

require('./config/passport');   // register strategies

const app = express();

// ─── Database ─────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('[DB] MongoDB connected'))
  .catch(err => { console.error('[DB] Connection error:', err); process.exit(1); });

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length
    ? (origin, cb) => {
        // Allow requests with no origin (server-to-server, curl, etc.)
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
      }
    : true,
  credentials: true
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Sessions (stored in MongoDB, expire in 1 day) ───────────────────────────
app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl:    process.env.MONGODB_URI,
    ttl:         24 * 60 * 60,   // 1 day in seconds
    autoRemove:  'native'
  }),
  cookie: {
    maxAge:   24 * 60 * 60 * 1000,   // 1 day in ms
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// ─── Passport ─────────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Serve Static Website Files ───────────────────────────────────────────────
// The backend lives in /backend — serve the parent folder as the web root
const SITE_ROOT = path.join(__dirname, '..');
app.use(express.static(SITE_ROOT));

// SPA-style fallback: unknown paths return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(SITE_ROOT, 'index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] NODE_ENV = ${process.env.NODE_ENV}`);
});
