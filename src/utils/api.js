/**
 * Safe API Utility
 */

export const apiFetch = async (url, options = {}) => {

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const isFormData = options.body instanceof FormData;

  const headers = {
    'ngrok-skip-browser-warning': '69420',
    ...options.headers,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body
      ? isFormData
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  });

  // Unauthorized
  if (response.status === 401) {
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    const errorMsg = data.message || data.error || 'Something went wrong';
    throw new Error(`[${response.status}] ${errorMsg}`);
  }

  return data;
};