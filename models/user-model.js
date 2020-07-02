const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    email: String,
    googleId: String,
    facebookId: String,
    picture: String,
  },
  { timestamps: true }
);

const User = mongoose.model('user', userSchema);
module.exports = User;
