const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//
// DISQUS
//

router.get('/disqus', passport.authenticate('disqus'));

router.get('/disqus/redirect', passport.authenticate('disqus'), (_req, res) => {
  res.redirect('/profile');
});

//
// GOOGLE
//

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get('/google/redirect', passport.authenticate('google'), (_req, res) => {
  res.redirect('/profile');
});

//
// FACEBOOK
//

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/redirect',
  passport.authenticate('facebook'),
  (_req, res) => {
    res.redirect('/profile');
  }
);

module.exports = router;
