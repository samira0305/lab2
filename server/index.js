require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// single API
app.use('/api/assignments', require('./routes/assignments'));

// health
app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lab2';

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  });
