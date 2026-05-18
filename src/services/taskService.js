import { apiFetch } from '../utils/api';

export const taskService = {
  // Create a new task
  createTask: (taskData) => apiFetch('/api/tasks', {
    method: 'POST',
    body: taskData
  }),

  // Update full task details
  updateTask: (taskId, taskData) => apiFetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    body: taskData
  }),

  // Delete a task
  deleteTask: (taskId) => apiFetch(`/api/tasks/${taskId}`, {
    method: 'DELETE'
  }),

  // Get single task by ID
  getTaskById: async (taskId) => {
    const data = await apiFetch(`/api/tasks/${taskId}`);
    return taskService.mapTask(data);
  },

  // Get all tasks with fallback retry for different endpoint patterns
  getAllTasks: async () => {
    try {
      const data = await apiFetch('/api/tasks');
      console.log('DEBUG: Raw Tasks Data from /api/tasks:', data);
      return taskService.extractTaskList(data);
    } catch (err) {
      console.warn('DEBUG: /api/tasks failed, trying /api/tasks/all...', err);
      try {
        const data = await apiFetch('/api/tasks/all');
        console.log('DEBUG: Raw Tasks Data from /api/tasks/all:', data);
        return taskService.extractTaskList(data);
      } catch (err2) {
        console.error('DEBUG: Both /api/tasks and /api/tasks/all failed.');
        throw err; // Throw the original error if fallback also fails
      }
    }
  },

  // Internal helper to extract task list from various formats
  extractTaskList: (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data.map(taskService.mapTask);
    
    if (typeof data === 'object') {
      // 1. Try known fields
      const taskList = data.content || data.data || data.tasks || data.taskList || data.body || [];
      if (Array.isArray(taskList) && taskList.length > 0) {
        return taskList.map(taskService.mapTask);
      }
      
      // 2. Try finding ANY array property in the object
      const firstArrayProp = Object.values(data).find(val => Array.isArray(val));
      if (firstArrayProp) {
        return firstArrayProp.map(taskService.mapTask);
      }
      
      // 3. If it looks like a single task object
      if (data.id || data.taskId || data.title) {
        return [taskService.mapTask(data)];
      }
    }
    
    return [];
  },

  // Helper to map backend task to frontend format
  mapTask: (task) => {
    if (!task) return null;
    
    // Handle priority which might be an object or a string
    let priorityVal = 'MEDIUM';
    if (typeof task.priority === 'string') {
      priorityVal = task.priority;
    } else if (task.priority && typeof task.priority === 'object' && task.priority.name) {
      priorityVal = task.priority.name;
    }
    const priority = priorityVal.toUpperCase();

    return {
      ...task, // Spread original fields for maximum compatibility
      id: (task.id || task.taskId || task.TASK_ID)?.toString(),
      title: task.title || task.name || task.taskName || 'Untitled Task',
      description: task.description || task.desc || '',
      status: task.status ? task.status.toString().toUpperCase().replace(/\s+/g, '_') : 'TODO',
      priority,
      date: task.dueDate || task.endDate || task.date || 'No date',
      assignee: task.assignedEmployeeName || task.employeeName || task.assigneeName || (task.employee && task.employee.fullName) || 'Unassigned',
      projectId: task.projectId || (task.project && task.project.id) || task.projId
    };
  },

  // Get tasks assigned to a specific employee
  getTasksByEmployee: async (employeeId) => {
    const data = await apiFetch(`/api/tasks/employee/${employeeId}`);
    console.log(`DEBUG: Raw Tasks for Employee ${employeeId}:`, data);
    return taskService.extractTaskList(data);
  },

  // Get tasks for a specific sprint
  getTasksBySprint: async (sprintId) => {
    const data = await apiFetch(`/api/tasks/sprint/${sprintId}`);
    const taskList = data?.content || data?.data || data || [];
    return Array.isArray(taskList) ? taskList.map(taskService.mapTask) : [];
  },

  // Get tasks for a specific project
  getTasksByProject: async (projectId) => {
    try {
      const data = await apiFetch(`/api/tasks/project/${projectId}`);
      return taskService.extractTaskList(data);
    } catch (err) {
      // Try alternative pattern if first fails
      try {
        const data = await apiFetch(`/api/projects/${projectId}/tasks`);
        return taskService.extractTaskList(data);
      } catch (err2) {
        return [];
      }
    }
  },

  // Update only task status (used for Kanban Drag & Drop)
  updateTaskStatus: (taskId, status) => apiFetch(`/api/tasks/${taskId}/status?status=${status}`, {
    method: 'PATCH'
  })
};
