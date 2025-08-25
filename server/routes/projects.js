const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const { project_code, project_name, project_description } = req.body;
    if (!project_code || !project_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const created = await Project.create({ project_code, project_name, project_description });
    res.status(201).json(created);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'project_code must be unique' });
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
