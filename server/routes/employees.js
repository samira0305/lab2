const express = require('express');
const Employee = require('../models/Employee');
const router = express.Router();

// POST /api/employees
router.post('/', async (req, res) => {
  try {
    const { employee_id, full_name, email, hashed_password } = req.body;
    if (!employee_id || !full_name || !email || !hashed_password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const created = await Employee.create({ employee_id, full_name, email, hashed_password });
    res.status(201).json(created);
  } catch (e) {
    // duplicate key -> unique constraint
    if (e.code === 11000) return res.status(409).json({ error: 'employee_id or email must be unique' });
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
