const express = require('express');
const Assignment = require('../models/Assignment');
const router = express.Router();

// add one assignment
router.post('/', async (req, res) => {
  try {
    const { employee_id, employee_name, project_name, start_date } = req.body;
    if (!employee_id || !employee_name || !project_name || !start_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const created = await Assignment.create({
      employee_id,
      employee_name,
      project_name,
      start_date: new Date(start_date)
    });
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// list latest 5 (newest first)
router.get('/', async (_req, res) => {
  try {
    const rows = await Assignment.find().sort({ start_date: -1 }).limit(5);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
