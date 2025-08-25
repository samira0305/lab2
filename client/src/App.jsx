import { useEffect, useState } from 'react';
import { fetchAssignments } from './api';

export default function App() {
  const [rows, setRows] = useState([]);
  const [sort, setSort] = useState({ key: 'start_date', dir: 'desc' });

  async function load() {
    const data = await fetchAssignments(5);
   
    const normalized = data.map(d => ({
      _id: d._id,
      employee_id: d.employee_id ?? d.employee?.employee_id,
      employee_name: d.employee_name ?? d.employee?.full_name,
      project_name: d.project_name ?? d.project?.project_name,
      start_date: d.start_date
    }));
    setRows(normalized);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000); 
    return () => clearInterval(t);
  }, []);

  function onSort(key) {
    setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
  }

  const sorted = [...rows].sort((a, b) => {
    const { key, dir } = sort;
    const A = a[key], B = b[key];
    if (A === B) return 0;
    const cmp = A > B ? 1 : -1;
    return dir === 'asc' ? cmp : -1 * cmp;
  });

  return (
    <div style={{ padding: 16 }}>
      <h1>Latest Project Assignments</h1>
      <table>
        <thead>
          <tr>
            <th onClick={() => onSort('employee_id')}>Employee_ID</th>
            <th onClick={() => onSort('employee_name')}>Employee_name</th>
            <th onClick={() => onSort('project_name')}>Project_name</th>
            <th onClick={() => onSort('start_date')}>Start_date</th>
          </tr>
        </thead>
        <tbody>
          {sorted.slice(0,5).map(r => (
            <tr key={r._id}>
              <td>{r.employee_id}</td>
              <td>{r.employee_name}</td>
              <td>{r.project_name}</td>
              <td>{new Date(r.start_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
