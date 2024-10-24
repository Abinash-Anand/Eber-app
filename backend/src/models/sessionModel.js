const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  sessionId: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  remainingTime: {
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 59 },
    seconds: { type: Number, default: 60 }
  },
  lastUpdated: { type: Date, default: Date.now },
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
