const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user-model');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) =>
  User.findById(id).then((user) => done(null, user))
);

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    (_accessToken, _refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // console.log('User is: ', currentUser);
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
              // console.log(`Created: ${newUser}`);
              done(null, newUser);
            });
        }
      });
    }
  )
);
