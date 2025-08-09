
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // We'll use this now
const bodyParser = require('body-parser'); // We'll use this now
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies and enable CORS
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// Import and use our API routes
const chatRoutes = require('./routes/chat');
app.use('/api', chatRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});











































// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected successfully!'))
// .catch(err => console.error('MongoDB connection error:', err));

// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });