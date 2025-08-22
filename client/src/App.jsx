import { useEffect, useMemo, useState } from "react";
import { fetchAssignments } from "./api";
import "./App.css";

export default function App() {
  const [rows, setRows] = useState([]);
  const [sort, setSort] = useState({ key: "start_date", dir: "desc" });
  const [status, setStatus] = useState("Loading...");

  async function load() {
    try {
      setStatus("Loading...");
      const data = await fetchAssignments();
      setRows(data);
      setStatus(`Loaded ${data.length} assignments`);
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, []);

  function onSort(key) {
    setSort(s => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));
  }

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const ak = a[sort.key];
      const bk = b[sort.key];
      if (sort.key === "start_date") {
        const ad = new Date(ak).getTime();
        const bd = new Date(bk).getTime();
        return sort.dir === "asc" ? ad - bd : bd - ad;
      }
      const sa = String(ak ?? "").toLowerCase();
      const sb = String(bk ?? "").toLowerCase();
      if (sa < sb) return sort.dir === "asc" ? -1 : 1;
      if (sa > sb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr.slice(0, 5);
  }, [rows, sort]);

  return (
    <div className="container">
      <h1>Project Assignments</h1>
      <div className="controls">
        <button onClick={load}>Refresh</button>
        <span className="small">{status}</span>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th onClick={() => onSort("employee_id")}>Employee_ID</th>
            <th onClick={() => onSort("employee_name")}>Employee_name</th>
            <th onClick={() => onSort("project_name")}>Project_name</th>
            <th onClick={() => onSort("start_date")}>Start_date</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr><td colSpan="4" className="small">No assignments yet.</td></tr>
          ) : (
            sorted.map(row => (
              <tr key={row._id}>
                <td>{row.employee_id}</td>
                <td>{row.employee_name}</td>
                <td>{row.project_name}</td>
                <td>{new Date(row.start_date).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <p className="small">Tip: Click a column header to sort. Data auto-refreshes every minute.</p>
    </div>
  );
}
