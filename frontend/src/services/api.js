const BASE_URL = 'http://localhost:8000/api';

// ── LOCAL STORAGE version (Phase 2) ──────────────────────────────
export function saveResume(data) {
  localStorage.setItem('resumeState', JSON.stringify(data));
  return Promise.resolve({ ok: true });
}

export function loadResume() {
  const raw = localStorage.getItem('resumeState');
  return Promise.resolve(raw ? JSON.parse(raw) : null);
}

// ── DJANGO API version (Phase 3 — uncomment when backend is ready) ──
// export async function saveResume(data) {
//   const res = await fetch(`${BASE_URL}/resumes/`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data)
//   })
//   return res.json()
// }
//
// export async function loadResume(id) {
//   const res = await fetch(`${BASE_URL}/resumes/${id}/`)
//   return res.json()
// }
