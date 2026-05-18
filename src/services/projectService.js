import { apiFetch } from '../utils/api';

/**
 * Project Service
 * Handles all project-related API interactions with the Spring Boot backend.
 */

export const projectService = {

  /**
   * GET all projects
   */
  getProjects: async () => {
    const data = await apiFetch('/api/projects');
    const projectList = data?.content || data?.data || data || [];
    return Array.isArray(projectList) ? projectList.map(projectService.mapProject) : [];
  },

  /**
   * Helper to map project data from backend to frontend format
   */
  mapProject: (project) => {
    const priority = (project.priority || 'MEDIUM').toUpperCase();
    const formattedPriority = priority.charAt(0) + priority.slice(1).toLowerCase();

    return {
      ...project,
      id: project.id || project.projectId,
      name: project.name || project.projectName || 'Untitled Project',
      managerName: project.manager?.username || project.managerName || 'Unassigned',
      status: project.status || 'PENDING',
      priority: formattedPriority,
      skills: Array.isArray(project.skills) ? project.skills : []
    };
  },

  /**
   * GET single project by ID
   */
  getProjectById: async (id) => {
    const data = await apiFetch(`/api/projects/${id}`);
    return projectService.mapProject(data);
  },

  /**
   * CREATE new project
   */
  createProject: (data) =>
    apiFetch('/api/projects', {
      method: 'POST',
      body: data
    }),

  /**
   * UPDATE existing project
   */
  updateProject: (id, data) =>
    apiFetch(`/api/projects/${id}`, {
      method: 'PUT',
      body: data
    }),

  /**
   * DELETE project
   */
  deleteProject: (id) =>
    apiFetch(`/api/projects/${id}`, {
      method: 'DELETE'
    }),

  /**
   * GET projects assigned to logged-in manager
   */
  getManagerProjects: async () => {
    const data = await apiFetch('/api/projects/my-projects');
    const projectList = data?.content || data?.data || data || [];
    return Array.isArray(projectList) ? projectList.map(projectService.mapProject) : [];
  },

  /**
   * GET manager dashboard stats
   */
  getManagerStats: (managerId) =>
    apiFetch(`/api/manager/stats/${managerId}`)
};