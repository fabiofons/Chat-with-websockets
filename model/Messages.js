const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  body: String,
  date: String,
  user: String
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
