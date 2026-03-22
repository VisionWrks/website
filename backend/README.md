# VisionWorks Backend

Express.js authentication server for the VisionWorks website. Handles user registration, login, Google OAuth, Apple Sign In, and session management backed by MongoDB.

---

## Requirements

- Node.js 18+
- A MongoDB Atlas cluster (connection string in `.env`)

---

## Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in the values (the MongoDB URI is already set):

```bash
cp .env.example .env
```

Start the server:

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

The server runs on **http://localhost:5000** and serves:
- The website static files at `/`
- The auth API at `/api/auth/`
- The login/signup page at `/auth.html`

---

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | Secret used to sign session cookies — change this in production |
| `FRONTEND_URL` | Origin of the frontend, used for CORS and OAuth redirects |
| `PORT` | Port the server listens on (default: `5000`) |
| `NODE_ENV` | `development` or `production` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | Full URL for the Google OAuth callback |
| `APPLE_CLIENT_ID` | Apple Services ID |
| `APPLE_TEAM_ID` | Apple Developer Team ID |
| `APPLE_KEY_ID` | Apple key ID for Sign In with Apple |
| `APPLE_PRIVATE_KEY` | Contents of the `.p8` private key file (newlines as `\n`) |
| `APPLE_CALLBACK_URL` | Full URL for the Apple OAuth callback (must be HTTPS in production) |

---

## API Reference

All endpoints are under `/api/auth`.

### `POST /api/auth/signup`
Register a new user with email and password.

**Body**
```json
{ "name": "string", "email": "string", "password": "string (min 8 chars)" }
```

**Response `201`**
```json
{ "user": { "id": "...", "name": "...", "email": "...", "avatar": null, "createdAt": "..." } }
```

---

### `POST /api/auth/login`
Log in with email and password.

**Body**
```json
{ "email": "string", "password": "string" }
```

**Response `200`**
```json
{ "user": { "id": "...", "name": "...", "email": "...", "avatar": null, "createdAt": "..." } }
```

---

### `GET /api/auth/google`
Redirect the browser here to start Google OAuth. Redirects back to `/auth.html?success=1` on success or `/auth.html?error=google` on failure.

### `GET /api/auth/google/callback`
OAuth callback — handled automatically by Passport.

---

### `GET /api/auth/apple`
Redirect the browser here to start Apple Sign In. Redirects back to `/auth.html?success=1` on success or `/auth.html?error=apple` on failure.

### `POST /api/auth/apple/callback`
OAuth callback — handled automatically by Passport. Apple sends a POST request.

---

### `GET /api/auth/me`
Returns the currently logged-in user. Requires an active session.

**Response `200`**
```json
{ "user": { "id": "...", "name": "...", "email": "...", "avatar": "...", "createdAt": "..." } }
```

**Response `401`** — not authenticated.

---

### `POST /api/auth/logout`
Ends the current session.

**Response `200`**
```json
{ "message": "Logged out." }
```

---

## Sessions

Sessions are stored in MongoDB via `connect-mongo` and expire after **1 day**. The session cookie is `httpOnly` and, in production, `secure` and `sameSite: none` (required for cross-origin requests over HTTPS).

---

## Setting Up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add an authorised redirect URI:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
4. Copy the **Client ID** and **Client Secret** into `.env`

---

## Setting Up Apple Sign In

> Apple Sign In requires the callback URL to use **HTTPS**. It cannot be tested locally without a tunnel (e.g. ngrok).

1. Sign in to [developer.apple.com](https://developer.apple.com) → **Certificates, Identifiers & Profiles**
2. Create a **Services ID** (this is your `APPLE_CLIENT_ID`) and enable *Sign In with Apple*
3. Configure the return URL: `https://yourdomain.com/api/auth/apple/callback`
4. Go to **Keys**, create a new key, enable *Sign In with Apple*, and download the `.p8` file
5. Note your **Team ID** (top-right of the developer portal) and the **Key ID**
6. Paste the full contents of the `.p8` file into `APPLE_PRIVATE_KEY` in `.env`, replacing newlines with `\n`

---

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Replace `SESSION_SECRET` with a long random string
- [ ] Update `FRONTEND_URL` to your live domain
- [ ] Update OAuth callback URLs to your live domain
- [ ] Serve behind HTTPS (required for secure cookies and Apple Sign In)
- [ ] Do not commit `.env` to version control
