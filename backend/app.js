require('dotenv').config();

const express    = require('express');
const session    = require('express-session');
const MongoStore = require('connect-mongo');
const passport   = require('passport');
const cors       = require('cors');
const mongoose   = require('mongoose');

require('./config/passport');

const app = express();

// ─── Database (cached for serverless) ────────────────────────────────────────
mongoose.set('bufferCommands', false);  // don't queue ops while disconnected

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,   // fail fast instead of hanging
    socketTimeoutMS:          45000,
    maxPoolSize:              1        // one connection per serverless instance
  })
    .then(() => console.log('[DB] MongoDB connected'))
    .catch(err => console.error('[DB] Connection error:', err));
}

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length
    ? (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
      }
    : true,
  credentials: true
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Sessions ─────────────────────────────────────────────────────────────────
app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongooseConnection: mongoose.connection,  // reuse the same connection
    ttl:                24 * 60 * 60,
    autoRemove:         'native'
  }),
  cookie: {
    maxAge:   24 * 60 * 60 * 1000,
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// ─── Passport ─────────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Static Files (local dev only) ───────────────────────────────────────────
// On Vercel, static files are served by the CDN — no need for Express to handle them.
if (!process.env.VERCEL) {
  const path      = require('path');
  const SITE_ROOT = path.join(__dirname, '..');
  app.use(express.static(SITE_ROOT));
  app.get('*', (req, res) => res.sendFile(path.join(SITE_ROOT, 'index.html')));
}

module.exports = app;
