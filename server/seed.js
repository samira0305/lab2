require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const Project = require('./models/Project');
const ProjectAssignment = require('./models/ProjectAssignment');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('Seeding…');

  await Employee.deleteMany({});
  await Project.deleteMany({});
  await ProjectAssignment.deleteMany({});

  const employees = await Employee.insertMany([
    { employee_id: 'EMP001', full_name: 'Alice Johnson',  email: 'alice@example.com',  hashed_password: 'hash1' },
    { employee_id: 'EMP002', full_name: 'Bob Smith',      email: 'bob@example.com',    hashed_password: 'hash2' },
    { employee_id: 'EMP003', full_name: 'Carol Lee',      email: 'carol@example.com',  hashed_password: 'hash3' },
    { employee_id: 'EMP004', full_name: 'David Kim',      email: 'david@example.com',  hashed_password: 'hash4' },
    { employee_id: 'EMP005', full_name: 'Eva Martinez',   email: 'eva@example.com',    hashed_password: 'hash5' }
  ]);

  const projects = await Project.insertMany([
    { project_code: 'PRJ001', project_name: 'AI Platform',     project_description: 'Internal AI tool' },
    { project_code: 'PRJ002', project_name: 'Mobile App',      project_description: 'Customer mobile app' },
    { project_code: 'PRJ003', project_name: 'Data Pipeline',   project_description: 'Analytics ETL' },
    { project_code: 'PRJ004', project_name: 'Website Revamp',  project_description: 'Marketing site' },
    { project_code: 'PRJ005', project_name: 'CRM Upgrade',     project_description: 'Salesforce work' }
  ]);

  const byEmpId = Object.fromEntries(employees.map(e => [e.employee_id, e]));
  const byPrj   = Object.fromEntries(projects.map(p => [p.project_code, p]));

  const toMake = [
    { employee_id: 'EMP001', project_code: 'PRJ001', start_date: '2024-11-01' },
    { employee_id: 'EMP002', project_code: 'PRJ003', start_date: '2024-11-15' },
    { employee_id: 'EMP003', project_code: 'PRJ002', start_date: '2025-01-05' },
    { employee_id: 'EMP004', project_code: 'PRJ004', start_date: '2025-02-10' },
    { employee_id: 'EMP005', project_code: 'PRJ005', start_date: '2025-03-20' },
  ];

  for (const a of toMake) {
    await ProjectAssignment.create({
      employee: byEmpId[a.employee_id]._id,
      project:  byPrj[a.project_code]._id,
      start_date: new Date(a.start_date)
    });
  }

  console.log('Done.');
  await mongoose.disconnect();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
