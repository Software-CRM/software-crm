import { apiFetch } from '../utils/api';

export const profileService = {
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiFetch('/api/profile/upload', {
      method: 'POST',
      body: formData,
    });
  },

  updateProfile: async (profileData) => {
    return await apiFetch('/api/profile/update', {
      method: 'PUT',
      body: profileData,
    });
  },
};
