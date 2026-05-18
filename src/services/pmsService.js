import { apiFetch } from '../utils/api';

export const sprintService = {
  getAllSprints: () => apiFetch('/api/sprints'),
  createSprint: (data) => apiFetch('/api/sprints', { method: 'POST', body: data }),
  updateSprint: (id, data) => apiFetch(`/api/sprints/${id}`, { method: 'PUT', body: data }),
  deleteSprint: (id) => apiFetch(`/api/sprints/${id}`, { method: 'DELETE' }),
  startSprint: (id) => apiFetch(`/api/sprints/${id}/start`, { method: 'POST' }),
  endSprint: (id) => apiFetch(`/api/sprints/${id}/end`, { method: 'POST' })
};

export const bugService = {
  getAllBugs: () => apiFetch('/api/bugs'),
  createBug: (data) => apiFetch('/api/bugs', { method: 'POST', body: data }),
  updateBug: (id, data) => apiFetch(`/api/bugs/${id}`, { method: 'PUT', body: data }),
  deleteBug: (id) => apiFetch(`/api/bugs/${id}`, { method: 'DELETE' }),
  addComment: (id, comment) => apiFetch(`/api/bugs/${id}/comments`, { method: 'POST', body: { comment } })
};


