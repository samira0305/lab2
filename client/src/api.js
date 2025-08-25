export async function fetchAssignments(limit = 5) {
  const res = await fetch(`/api/project_assignments?limit=${limit}`);
  if (!res.ok) throw new Error(`Failed to fetch assignments (${res.status})`);
  return res.json();
}
