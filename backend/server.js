// Local development server — not used on Vercel
const app  = require('./app');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[Server] NODE_ENV = ${process.env.NODE_ENV}`);
});
