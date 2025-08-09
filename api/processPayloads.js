const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const Message = require('./models/message');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for processing...'))
.catch(err => console.error('MongoDB connection error:', err));

const payloadsDir = path.join(__dirname, 'payloads');
const files = fs.readdirSync(payloadsDir);

const processPayloads = async () => {
  for (const file of files) {
    console.log(`Processing file: ${file}`);
    let payload;
    try {
      payload = JSON.parse(fs.readFileSync(path.join(payloadsDir, file)));
    } catch (err) {
      console.error(`Error parsing JSON in file ${file}:`, err.message);
      continue;
    }

    // Correctly access the 'entry' array from the 'metaData' field
    const entry = payload.metaData && payload.metaData.entry ? payload.metaData.entry[0] : null;

    if (!entry || !entry.changes || !entry.changes[0]) {
      console.warn(`Skipping file ${file}: Invalid payload structure.`);
      continue;
    }

    const changes = entry.changes[0];
    const value = changes.value;

    if (value.messages) {
      // Process new messages
      const msg = value.messages[0];
      const newMessage = {
        id: msg.id,
        wa_id: msg.from,
        timestamp: new Date(msg.timestamp * 1000),
        type: msg.type,
        text: msg.text,
        from_me: false,
      };

      try {
        await Message.create(newMessage);
        console.log(`New message from ${newMessage.wa_id} saved.`);
      } catch (err) {
        console.error(`Error saving message with ID ${newMessage.id}:`, err.message);
      }
    } else if (value.statuses) {
      // Process status updates
      const status = value.statuses[0];
      try {
        // Use 'id' or 'meta_msg_id' to find the corresponding message
        await Message.findOneAndUpdate(
          { id: status.id || status.meta_msg_id },
          { $push: { statuses: { status: status.status, timestamp: new Date(status.timestamp * 1000) } } },
          { new: true }
        );
        console.log(`Status for message ID ${status.id || status.meta_msg_id} updated to '${status.status}'.`);
      } catch (err) {
        console.error(`Error updating status for message with ID ${status.id || status.meta_msg_id}:`, err.message);
      }
    }
  }
  console.log('Payload processing complete.');
  mongoose.disconnect();
};

processPayloads();