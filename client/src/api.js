export async function fetchAssignments() {
  const res = await fetch("/api/assignments");
  if (!res.ok) throw new Error("Failed to fetch assignments");
  return res.json();
}
