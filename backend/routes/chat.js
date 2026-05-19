const router = require('express').Router();
const mongoose = require('mongoose');
const Groq = require('groq-sdk');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated.' });
}

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Fetch relevant data from MongoDB based on the query
async function getRelevantContext(username, query) {
  const db = mongoose.connection.db;

  // Fetch ALL user's inspection sessions (no limit)
  const sessions = await db
    .collection('inspection_sessions')
    .find({ username })
    .sort({ started_at: -1 })
    .toArray();

  // Calculate summary statistics
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const failedSessions = sessions.filter(s => s.status === 'failed').length;
  const skippedSessions = sessions.filter(s => s.status === 'skipped').length;
  const inProgressSessions = sessions.filter(s => s.status === 'in_progress').length;

  // Calculate total steps and average duration
  let totalSteps = 0;
  let totalDuration = 0;
  let sessionsWithDuration = 0;

  sessions.forEach(session => {
    if (session.steps) {
      totalSteps += session.steps.length;
    }
    if (session.started_at && session.finished_at) {
      const duration = (new Date(session.finished_at) - new Date(session.started_at)) / 1000;
      if (duration > 0) {
        totalDuration += duration;
        sessionsWithDuration++;
      }
    }
  });

  const avgDuration = sessionsWithDuration > 0 ? (totalDuration / sessionsWithDuration).toFixed(1) : 0;

  // Get production line breakdown
  const lineBreakdown = {};
  sessions.forEach(session => {
    const line = session.line_id || 'unknown';
    lineBreakdown[line] = (lineBreakdown[line] || 0) + 1;
  });

  // Get monthly breakdown with status details
  const monthlyBreakdown = {};
  sessions.forEach(session => {
    if (session.started_at) {
      const d = new Date(session.started_at);
      const monthKey = `${d.toLocaleString('en', { month: 'long' })} ${d.getFullYear()}`;
      if (!monthlyBreakdown[monthKey]) {
        monthlyBreakdown[monthKey] = { total: 0, completed: 0, failed: 0, skipped: 0, in_progress: 0 };
      }
      monthlyBreakdown[monthKey].total++;
      if (session.status) {
        monthlyBreakdown[monthKey][session.status] = (monthlyBreakdown[monthKey][session.status] || 0) + 1;
      }
    }
  });

  // Get daily breakdown for current month
  const now = new Date();
  const currentMonthSessions = sessions.filter(s => {
    if (!s.started_at) return false;
    const d = new Date(s.started_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const dailyBreakdown = {};
  currentMonthSessions.forEach(session => {
    const d = new Date(session.started_at);
    const dayKey = d.toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!dailyBreakdown[dayKey]) {
      dailyBreakdown[dayKey] = { total: 0, completed: 0, failed: 0, skipped: 0 };
    }
    dailyBreakdown[dayKey].total++;
    if (session.status && session.status !== 'in_progress') {
      dailyBreakdown[dayKey][session.status]++;
    }
  });

  // Get line breakdown per month
  const lineMonthlyBreakdown = {};
  sessions.forEach(session => {
    if (session.started_at && session.line_id) {
      const d = new Date(session.started_at);
      const monthKey = `${d.toLocaleString('en', { month: 'long' })} ${d.getFullYear()}`;
      const key = `${session.line_id} - ${monthKey}`;
      lineMonthlyBreakdown[key] = (lineMonthlyBreakdown[key] || 0) + 1;
    }
  });

  // Format all sessions for context (concise format)
  const allSessionsFormatted = sessions.map(s => {
    const date = s.started_at ? new Date(s.started_at).toLocaleDateString() : 'N/A';
    const stepsCount = s.steps ? s.steps.length : 0;
    const completedSteps = s.steps ? s.steps.filter(st => st.status === 'completed').length : 0;
    const failedSteps = s.steps ? s.steps.filter(st => st.status === 'failed').length : 0;
    return `${date} | ${s.line_id || 'N/A'} | ${s.status} | Steps: ${completedSteps}/${stepsCount} | Failed: ${failedSteps}`;
  });

  // Build context string
  const context = `
DATABASE CONTEXT FOR USER: ${username}

=== SUMMARY STATISTICS ===
- Total Sessions: ${totalSessions}
- Completed Sessions: ${completedSessions} (${totalSessions > 0 ? ((completedSessions/totalSessions)*100).toFixed(1) : 0}%)
- Failed Sessions: ${failedSessions} (${totalSessions > 0 ? ((failedSessions/totalSessions)*100).toFixed(1) : 0}%)
- Skipped Sessions: ${skippedSessions} (${totalSessions > 0 ? ((skippedSessions/totalSessions)*100).toFixed(1) : 0}%)
- In Progress Sessions: ${inProgressSessions}
- Total Steps Performed: ${totalSteps}
- Average Session Duration: ${avgDuration} seconds

=== PRODUCTION LINE BREAKDOWN (Total) ===
${Object.entries(lineBreakdown).map(([line, count]) => `- ${line}: ${count} sessions`).join('\n')}

=== MONTHLY BREAKDOWN ===
${Object.entries(monthlyBreakdown).map(([month, data]) =>
  `- ${month}: ${data.total} total (${data.completed} completed, ${data.failed} failed, ${data.skipped} skipped, ${data.in_progress || 0} in progress)`
).join('\n')}

=== LINE BREAKDOWN BY MONTH ===
${Object.entries(lineMonthlyBreakdown).map(([key, count]) => `- ${key}: ${count} sessions`).join('\n')}

=== DAILY BREAKDOWN (Current Month) ===
${Object.entries(dailyBreakdown).map(([day, data]) =>
  `- ${day}: ${data.total} total (${data.completed} completed, ${data.failed} failed, ${data.skipped} skipped)`
).join('\n')}

=== ALL SESSIONS (${sessions.length} total) ===
Format: Date | Line | Status | Steps (completed/total) | Failed Steps
${allSessionsFormatted.join('\n')}
`;

  return context;
}

// POST /api/chat - Handle chat messages
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured.' });
    }

    // Get relevant context from MongoDB
    const context = await getRelevantContext(req.user.name, message);

    const systemPrompt = `You are a helpful assistant for VisionWorks, an industrial inspection analytics platform.
You have access to the user's COMPLETE inspection session data from the database.
Answer questions about their inspection data, provide insights, and help them understand their performance metrics.
Be concise but informative. Always reference the actual numbers from the context when answering.
If the user asks something not related to their inspection data, politely help them but mention you specialize in inspection analytics.

${context}`;

    // Build messages array for Groq
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = chatCompletion.choices[0]?.message?.content || 'No response generated.';

    res.json({
      response,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to process chat message: ' + err.message });
  }
});

module.exports = router;
