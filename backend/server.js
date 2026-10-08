const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS: open by default (local dev). In production (Render), set
// FRONTEND_URL to your Vercel URL(s), comma-separated, to restrict access:
// FRONTEND_URL=https://kusina.vercel.app
const frontendUrls = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({ origin: frontendUrls.length > 0 ? frontendUrls : true }));
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Kusina Backend API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
