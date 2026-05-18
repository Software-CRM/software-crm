import { apiFetch } from '../utils/api';

/**
 * Settings Service
 * Handles company branding, office locations, and business hours.
 */
export const settingsService = {
  /**
   * Get all company settings
   */
  getSettings: () => apiFetch('/api/settings'),

  /**
   * Update company settings
   */
  updateSettings: (settingsData) => apiFetch('/api/settings', {
    method: 'POST',
    body: settingsData
  })
};
