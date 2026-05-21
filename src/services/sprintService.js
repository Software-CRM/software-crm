import { apiFetch } from '../utils/api';

export const sprintService = {
  // Create a new sprint
  createSprint: (sprintData) => apiFetch('/api/sprints', {
    method: 'POST',
    body: sprintData
  }),

  // Start a sprint
  startSprint: (sprintId) => apiFetch(`/api/sprints/${sprintId}/start`, {
    method: 'PATCH'
  }),

  // End/Complete a sprint
  endSprint: (sprintId) => apiFetch(`/api/sprints/${sprintId}/end`, {
    method: 'PATCH'
  }),

  // Get sprint details by ID
  getSprintById: async (sprintId) => {
    const data = await apiFetch(`/api/sprints/${sprintId}`);
    return sprintService.mapSprint(data);
  },

  // Get all sprints
  getAllSprints: async () => {
    const data = await apiFetch('/api/sprints');
    const sprintList = data?.content || data?.data || data || [];
    return Array.isArray(sprintList) ? sprintList.map(sprintService.mapSprint) : [];
  },

  // Helper to map sprint data from backend to frontend format
  mapSprint: (sprint) => ({
    ...sprint,
    id: sprint.id || sprint.sprintId,
    name: sprint.name || sprint.sprintName || 'Untitled Sprint',
    status: (sprint.status || 'PLANNED').toUpperCase()
  })
};
