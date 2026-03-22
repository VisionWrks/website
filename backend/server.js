// Local development server — not used on Vercel
const path    = require('path');
const express = require('express');
const app     = require('./app');

// Serve the static website files in local dev
const SITE_ROOT = path.join(__dirname, '..');
app.use(express.static(SITE_ROOT));
app.get('*', (req, res) => res.sendFile(path.join(SITE_ROOT, 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] NODE_ENV = ${process.env.NODE_ENV}`);
});
