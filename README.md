# VisionWorks Website

AI-powered industrial vision inspection platform with real-time analytics, multi-language support (Arabic/English), and secure authentication.

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Passport.js
- **Frontend:** Vanilla JavaScript, Tailwind CSS, Chart.js
- **AI:** Groq API (LLaMA 3.3-70B)
- **Auth:** Email/Password, Google OAuth, Apple Sign In

## Project Structure

```
website/
├── backend/                    # Express server
│   ├── server.js               # Entry point
│   ├── app.js                  # Express app configuration
│   ├── config/
│   │   └── passport.js         # Authentication strategies
│   ├── models/
│   │   └── User.js             # User schema
│   └── routes/
│       ├── auth.js             # Authentication endpoints
│       ├── chat.js             # AI chat endpoint
│       └── inspections.js      # Inspection data endpoints
│
├── api/
│   └── index.js                # Vercel serverless wrapper
│
├── index.html                  # Landing page
├── auth.html                   # Login/Signup page
├── dashboard.html              # Analytics dashboard
├── qumraone.html               # Product page
├── privacy.html                # Privacy policy
├── content.js                  # Site content data
│
├── media/                      # Images and videos
├── vercel.json                 # Vercel deployment config
├── render.yaml                 # Render deployment config
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key (for chat feature)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd website

# Install dependencies
npm install

# Create environment file
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

### Environment Variables

Create `backend/.env`:

```env
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
SESSION_SECRET=your-random-secret-string

# Optional - Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5000

# Optional - Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Optional - Apple Sign In
APPLE_CLIENT_ID=...
APPLE_TEAM_ID=...
APPLE_KEY_ID=...
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
APPLE_CALLBACK_URL=https://yourdomain.com/api/auth/apple/callback

# Optional - AI Chat
GROQ_API_KEY=gsk_...
```

### Running Locally

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register with email/password |
| POST | `/login` | Login with email/password |
| GET | `/google` | Initiate Google OAuth |
| GET | `/google/callback` | Google OAuth callback |
| GET | `/apple` | Initiate Apple Sign In |
| POST | `/apple/callback` | Apple Sign In callback |
| POST | `/logout` | End session |
| GET | `/me` | Get current user |

### Inspections (`/api/inspections`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's inspection sessions |

### Chat (`/api/chat`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Send message to AI assistant |

## Frontend Pages

| Page | Purpose |
|------|---------|
| `index.html` | Landing page with services, portfolio, tutorials |
| `auth.html` | Login and signup forms |
| `dashboard.html` | Inspection analytics with charts |
| `qumraone.html` | Product showcase |
| `privacy.html` | Privacy policy |

## Content Management

Site content is centralized in `content.js`. Edit this file to update:

- **SERVICES** - Service offerings
- **PORTFOLIO** - Client case studies
- **TUTORIALS** - LinkedIn embedded tutorials
- **POSTS** - LinkedIn feed posts

See [README-linkedin-posts.md](./README-linkedin-posts.md) for LinkedIn integration details.

## Database Schema

### Users Collection

```javascript
{
  name: String,
  email: String,        // unique, lowercase
  password: String,     // bcrypt hashed
  googleId: String,
  appleId: String,
  avatar: String,
  createdAt: Date
}
```

### Inspection Sessions Collection

```javascript
{
  username: String,
  line_id: String,
  status: String,       // 'completed' | 'failed' | 'skipped'
  started_at: Date,
  finished_at: Date,
  steps: [{
    status: String,
    failed_attempts: Number
  }]
}
```

## Authentication Flow

1. **Local Auth:** Email/password with bcrypt hashing
2. **Google OAuth:** Passport google-oauth20 strategy
3. **Apple Sign In:** Passport apple strategy (requires HTTPS)

Sessions are stored in MongoDB with 24-hour TTL.

## AI Chat Feature

The dashboard includes an AI assistant powered by Groq API:

- Uses LLaMA 3.3-70B model
- Has access to user's inspection data context
- Provides insights about inspection performance
- Maintains conversation history per session

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Configuration is in `vercel.json`. Set environment variables in the Vercel dashboard.

### Render

1. Connect GitHub repo to Render
2. Render auto-detects `render.yaml`
3. Set environment variables in dashboard
4. Deploy

The server includes a keep-alive ping to prevent Render free tier spin-down.

## Development Tasks

### Adding a New API Route

1. Create route file in `backend/routes/`:
   ```javascript
   const router = require('express').Router();

   router.get('/', async (req, res) => {
     res.json({ message: 'Hello' });
   });

   module.exports = router;
   ```

2. Register in `backend/app.js`:
   ```javascript
   app.use('/api/myroute', require('./routes/myroute'));
   ```

### Adding Content

Edit `content.js` arrays:

```javascript
// Add a new service
SERVICES.push({
  en: { title: "New Service", desc: "Description" },
  ar: { title: "خدمة جديدة", desc: "الوصف" }
});

// Add a new portfolio item
PORTFOLIO.push({
  logo: "media/logo-client.png",
  client: "Client Name",
  url: "https://client.com",
  en: { tag: "Industry", title: "Project", desc: "Description" },
  ar: { tag: "الصناعة", title: "المشروع", desc: "الوصف" }
});
```

### Bilingual Support

All text uses `data-en` and `data-ar` attributes:

```html
<p data-en="Hello" data-ar="مرحبا">مرحبا</p>
```

The `setLang()` function toggles between languages and handles RTL.

## Security

- Passwords hashed with bcrypt (12 rounds)
- HTTP-only session cookies
- Secure cookies in production
- Environment variables for secrets
- No sensitive data in API responses

## Troubleshooting

### Session Not Persisting

- Check `MONGODB_URI` is correct
- Ensure `SESSION_SECRET` is set
- Verify cookies are enabled in browser

### OAuth Not Working

- Verify OAuth credentials in `.env`
- Check callback URLs match exactly
- Apple requires HTTPS callback URL

### Chat Returns Errors

- Verify `GROQ_API_KEY` is set
- Check Groq API rate limits
- Review server logs for details

## License

Proprietary - VisionWorks Ltd.
