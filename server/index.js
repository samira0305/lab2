require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- Debug endpoint: confirm DB & state ---
app.get('/api/__debug/db', (_req, res) => {
  res.json({
    host: mongoose.connection.host,
    name: mongoose.connection.name,        // DB name should be "lab2"
    readyState: mongoose.connection.readyState // 1 = connected
  });
});

// --- API routes ---
app.use('/api/employees', require('./routes/employees'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/project_assignments', require('./routes/projectAssignments'));

// --- Health check ---
app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// --- Serve static build (production) ---
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI; // Atlas URI with /lab2

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error:', err.message);
    process.exit(1);
  });
