const app  = require('./app');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] NODE_ENV = ${process.env.NODE_ENV}`);

  // Keep-alive ping — prevents Render free tier from spinning down
  const baseUrl = process.env.RENDER_EXTERNAL_URL;
  if (baseUrl) {
    setInterval(() => {
      fetch(`${baseUrl}/api/health`)
        .then(() => console.log('[Keep-alive] ping ok'))
        .catch(err => console.warn('[Keep-alive] ping failed:', err.message));
    }, 10 * 60 * 1000); // every 10 minutes
  }
});
