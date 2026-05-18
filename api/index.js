let app;

try {
  app = require('../backend/app');
} catch (err) {
  app = (req, res) => {
    res.status(500).json({
      error: 'Failed to load app',
      message: err.message
    });
  };
}

module.exports = app;
