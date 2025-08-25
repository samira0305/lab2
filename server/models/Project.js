const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project_code:        { type: String, required: true, unique: true, index: true },
  project_name:        { type: String, required: true },
  project_description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
