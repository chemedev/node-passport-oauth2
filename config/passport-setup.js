const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const DisqusStrategy = require('passport-disqus').Strategy;
const User = require('../models/user-model');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) =>
  User.findById(id).then((user) => done(null, user))
);

passport.use(
  new DisqusStrategy(
    {
      callbackURL: '/auth/disqus/redirect',
      clientID: process.env.DISQUS_CLIENT_ID,
      clientSecret: process.env.DISQUS_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ disqusId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            email: profile.emails[0] || '',
            disqusId: profile.id,
            picture: `https://disqus.com/api/users/avatars/${profile.username}.jpg`,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: process.env.GG_CLIENT_ID,
      clientSecret: process.env.GG_CLIENT_SECRET,
    },
    (_accessToken, _refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            username: profile._json.name,
            email: profile._json.email,
            googleId: profile._json.sub,
            picture: profile._json.picture,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      callbackURL: '/auth/facebook/redirect',
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      profileFields: ['id', 'email', 'name'],
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }).then((currentUser) => {
        if (currentUser) {
          done(null, currentUser);
        } else {
          new User({
            username: profile?.name || 'no username',
            email: profile?.email || 'no email',
            facebookId: profile?.id || 'no id',
            picture: profile?.picture || 'no picture',
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
