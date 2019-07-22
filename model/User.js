const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  user: {
    type: String,
    required: [true, 'is required'],
    lowercase: true,
    unique: true,
    trim: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;