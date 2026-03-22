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
let dbConnected = false;
async function connectDB() {
  if (dbConnected || mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
  dbConnected = true;
  console.log('[DB] MongoDB connected');
}
connectDB().catch(err => console.error('[DB] Connection error:', err));

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
// Serves the website for both Vercel (serverless) and local dev
const path     = require('path');
const SITE_ROOT = path.join(__dirname, '..');
app.use(express.static(SITE_ROOT));
app.get('*', (req, res) => res.sendFile(path.join(SITE_ROOT, 'index.html')));

module.exports = app;
