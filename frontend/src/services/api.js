// The base URL comes from .env
// In development: http://localhost:8000/api
// In production: https://yourapi.com/api  (just change .env)
const BASE_URL = 'http://localhost:8000/api';

/**
 * Central fetch wrapper
 *
 * Every API call goes through this function.
 * This means error handling, headers, and base URL
 * are defined in ONE place — not repeated in every call.
 *
 * Senior engineers never write raw fetch() calls scattered
 * across components. They centralize them exactly like this.
 */

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      //Later when we add auth: 'Authorization': `Bearer ${token}`
    },
    ...options,
    // If options has a body, stringify it
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // If response is not 2xx, throw an error with the server message
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP error: ${response.status}`);
    }

    // 204 No Content (DELETE) has no body — handle that
    if (response.status === 204) return null;

    return response.json();
  } catch (err) {
    // Re-throw so the calling component can handle it
    console.error(`API error [${endpoint}]:`, err.message);
    throw err;
  }
}

// ─── Resume endpoints ────────────────────────────────────────────────────────
// Each function maps to one Django API endpoint
// Clean, readable, one job each

export const resumeAPI = {
  // GET /api/resumes/ → fetch all resumes
  getAll() {
    return request('/resumes/');
  },

  // GET /api/resumes/1/ → fetch one resume by id
  getOne(id) {
    return request(`/resumes/${id}/`);
  },

  // POST /api/resumes/ → create a new resume, send full data
  create(data) {
    return request('/resumes/', {
      method: 'POST',
      body: data,
    });
  },

  // PUT /api/resumes/1/ → update a resume by id, send full data
  update(id, data) {
    return request(`/resumes/${id}/`, {
      method: 'PUT',
      body: data,
    });
  },

  // DELETE /api/resumes/1/ → delete a resume by id
  delete(id) {
    return request(`/resumes/${id}/`, {
      method: 'DELETE',
    });
  },

  exportPdf(id) {
    // Direct browser download — no fetch needed
    // Browser handles the file download automatically
    window.open(`${BASE_URL}/resumes/${id}/export`, '_blank');
  },

  // Add to resumeAPI object
  importPdf(file) {
    const formData = new FormData();
    formData.append('file', file);

    // Note: don't set Content-Type header — browser sets it automatically
    // with the correct multipart boundary when using FormData
    return fetch(`${BASE_URL}/resumes/import/`, {
      method: 'POST',
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `HTTP error: ${res.status}`);
      }
      return res.json();
    });
  },
};
