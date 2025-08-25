const express = require('express');
const Employee = require('../models/Employee');
const Project = require('../models/Project');
const ProjectAssignment = require('../models/ProjectAssignment');
const router = express.Router();

// POST /api/project_assignments
// body: { employee_id, project_code, start_date }
router.post('/', async (req, res) => {
  try {
    const { employee_id, project_code, start_date } = req.body;
    if (!employee_id || !project_code || !start_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const employee = await Employee.findOne({ employee_id });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const project = await Project.findOne({ project_code });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const created = await ProjectAssignment.create({
      employee: employee._id,
      project: project._id,
      start_date: new Date(start_date)
    });

    const populated = await created.populate('employee').populate('project');
    res.status(201).json(populated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/project_assignments?limit=5
router.get('/', async (req, res) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10) || 0;
    const rows = await ProjectAssignment.find()
      .sort({ start_date: -1 })
      .limit(limit)
      .populate('employee')
      .populate('project');

    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
