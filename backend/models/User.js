const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
