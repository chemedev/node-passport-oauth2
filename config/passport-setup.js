const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user-model');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) =>
  User.findById(id).then((user) => done(null, user))
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

passport.use(
  new FacebookStrategy(
    {
      callbackURL: '/auth/facebook/redirect',
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      profileFields: ['id', 'email', 'name'],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('profile', profile, refreshToken);
      console.log('refreshToken', refreshToken);
      console.log('accessToken', accessToken);
      return done(null, profile);
    }
    // User.findOne({ facebookId: profile.id }).then((currentUser) => {
    //   if (currentUser) {
    //     console.log('User is: ', currentUser);
    //     done(null, currentUser);
    //   } else {
    //     new User({
    //       username: profile._json.name,
    //       email: profile._json.email,
    //       googleId: profile._json.sub,
    //       picture: profile._json.picture,
    //     })
    //       .save()
    //       .then((newUser) => {
    //         console.log(`Created: ${newUser}`);
    //         done(null, newUser);
    //       });
    //   }
    // });
  )
);
