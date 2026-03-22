const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// ─── Serialize / Deserialize ────────────────────────────────────────────────
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// ─── Local (email + password) ────────────────────────────────────────────────
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.password) {
        return done(null, false, { message: 'Invalid email or password.' });
      }
      const match = await user.comparePassword(password);
      if (!match) return done(null, false, { message: 'Invalid email or password.' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// ─── Google OAuth ────────────────────────────────────────────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email  = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;

        // Try to find by googleId first
        let user = await User.findOne({ googleId: profile.id });

        if (!user && email) {
          // Link to existing account if email matches
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            if (!user.avatar && avatar) user.avatar = avatar;
            await user.save();
          } else {
            user = await User.create({
              name:     profile.displayName,
              email,
              googleId: profile.id,
              avatar
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
}

// ─── Apple Sign In ───────────────────────────────────────────────────────────
// Apple requires HTTPS for the callback URL in production.
// Configure APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY in .env
if (
  process.env.APPLE_CLIENT_ID &&
  process.env.APPLE_TEAM_ID   &&
  process.env.APPLE_KEY_ID    &&
  process.env.APPLE_PRIVATE_KEY
) {
  const AppleStrategy = require('passport-apple');
  passport.use(new AppleStrategy(
    {
      clientID:          process.env.APPLE_CLIENT_ID,
      teamID:            process.env.APPLE_TEAM_ID,
      keyID:             process.env.APPLE_KEY_ID,
      privateKeyString:  process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      callbackURL:       process.env.APPLE_CALLBACK_URL,
      passReqToCallback: false
    },
    async (accessToken, refreshToken, idToken, profile, done) => {
      try {
        const appleId = idToken.sub;
        const email   = idToken.email;
        // Apple only sends name on the very first sign-in
        const name    = profile?.name
          ? `${profile.name.firstName ?? ''} ${profile.name.lastName ?? ''}`.trim()
          : (email ?? appleId);

        let user = await User.findOne({ appleId });

        if (!user) {
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              user.appleId = appleId;
              await user.save();
            } else {
              user = await User.create({ name, email, appleId });
            }
          } else {
            // Private relay — no email exposed
            user = await User.create({
              name,
              email: `${appleId}@privaterelay.appleid.com`,
              appleId
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
}
