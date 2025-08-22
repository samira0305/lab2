const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  employee_id:   { type: String, required: true },
  employee_name: { type: String, required: true },
  project_name:  { type: String, required: true },
  start_date:    { type: Date,   required: true }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
