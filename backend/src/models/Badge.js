const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  icon: String,
  rarity: { type: String, default: 'common' },
  unlockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requirement: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Badge', badgeSchema);

