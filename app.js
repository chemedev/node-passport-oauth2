if (process.env.NODE_ENV === 'development') require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.set('view engine', 'ejs');

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

app.use(passport.initialize());
app.use(passport.session()); // Use session cookies.

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .then(() => app.listen(PORT))
  .then(() => console.log(`Running on http://${HOST}:${PORT}`))
  .catch((err) => console.error(err.message));

app.use('/auth', authRoutes, () => {}); // Auth routes
app.use('/profile', profileRoutes); // Profile routes

app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});
