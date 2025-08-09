const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  wa_id: { type: String, required: true }, // The user's WhatsApp ID
  timestamp: { type: Date, default: Date.now },
  type: String, // e.g., 'text', 'image', 'sent', 'delivered'
  text: {
    body: String,
  },
  statuses: [{
    status: String, // e.g., 'sent', 'delivered', 'read'
    timestamp: Date,
  }],
  from_me: { type: Boolean, default: false }, // To distinguish between incoming and outgoing messages
});

const Message = mongoose.model('Message', messageSchema, 'processed_messages');
module.exports = Message;