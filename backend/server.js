import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('PharmaGuard AI Backend is Running');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("--- BACKEND ERROR ---");
  console.error(err);
  console.error("---------------------");

  // Handle Multer errors specifically
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size too large. Max 5MB allowed.' });
  }

  const status = err.status || 500;
  const message = err.message || 'An unexpected error occurred on the server.';
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`\n--------------------------------------`);
  console.log(`🚀 PharmaGuard AI Backend Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`--------------------------------------\n`);
});
