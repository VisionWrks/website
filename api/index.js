let app;

try {
  app = require('../backend/app');
} catch (err) {
  console.error('[Vercel] Failed to load app:', err);
  app = (req, res) => {
    res.status(500).json({
      error: 'Failed to load app',
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
      code: err.code
    });
  };
}

module.exports = app;
