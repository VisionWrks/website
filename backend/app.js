require('dotenv').config();

// ─── Guard required env vars ──────────────────────────────────────────────────
const REQUIRED = ['MONGODB_URI', 'SESSION_SECRET'];
const missing  = REQUIRED.filter(k => !process.env[k]);
if (missing.length) {
  console.error('[Startup] Missing required env vars:', missing.join(', '));
  // Don't crash the process — return a 500 with a helpful message instead
}

const express    = require('express');
const session    = require('express-session');
const MongoStore = require('connect-mongo');
const passport   = require('passport');
const cors       = require('cors');
const mongoose   = require('mongoose');

require('./config/passport');

const app = express();

// Trust reverse proxy so secure cookies work over HTTPS
app.set('trust proxy', 1);

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
    mongoUrl:   process.env.MONGODB_URI,
    ttl:        24 * 60 * 60,
    autoRemove: 'native'
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

// ─── Static Files ─────────────────────────────────────────────────────────────
const path      = require('path');
const SITE_ROOT = path.join(__dirname, '..');
app.use(express.static(SITE_ROOT));
app.get('*', (req, res) => res.sendFile(path.join(SITE_ROOT, 'index.html')));

module.exports = app;
