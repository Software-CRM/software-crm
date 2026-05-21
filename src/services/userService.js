import { apiFetch } from '../utils/api';

/**
 * User Service
 * Handles user provisioning, employee management, and profile updates.
 */
export const userService = {

  /**
   * Get all users
   */
  getAllUsers: async () => {
    return await apiFetch('/api/admin/all-users');
  },

  /**
   * Create Employee
   */
  createEmployee: async (userData) => {

    const payload = {
      username: userData.username,
      fullName: userData.fullName,
      password: userData.password,
      role: 'EMPLOYEE'
    };

    return await apiFetch('/api/admin/create-employee', {
      method: 'POST',
      body: payload
    });
  },

  /**
   * Create Manager
   */
  createManager: async (userData) => {

    const payload = {
      username: userData.username,
      password: userData.password,
      role: 'MANAGER'
    };

    return await apiFetch('/api/admin/create-manager', {
      method: 'POST',
      body: payload
    });
  },

  /**
   * Create Client
   */
  createClient: async (userData) => {

    const payload = {
      username: userData.username,
      password: userData.password,
      role: 'CLIENT'
    };

    return await apiFetch('/api/admin/create-client', {
      method: 'POST',
      body: payload
    });
  },

  /**
   * Update User
   */
  updateUser: async (id, userData) => {

    const payload = {
      username: userData.username,
      password: userData.password,
      role: userData.role,
      active: userData.active
    };

    return await apiFetch(`/api/admin/update-user/${id}`, {
      method: 'PUT',
      body: payload
    });
  },

  /**
   * Delete User
   */
  deleteUser: async (id) => {
    return await apiFetch(`/api/admin/delete-user/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Get User By ID
   */
  getUserById: async (id) => {
    return await apiFetch(`/api/admin/user/${id}`);
  }
};