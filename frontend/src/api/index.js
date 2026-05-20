// src/api/index.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost/Toriventy/backend/public/api';

// Helper to attach JWT
const getHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response, endpoint) => {
  let data;
  const text = await response.text();
  
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    console.error('Failed to parse JSON:', text);
    throw new Error(`Invalid response from ${endpoint}: ${text}`);
  }

  if (!response.ok) {
    throw new Error(data.message || `${endpoint} failed (${response.status})`);
  }

  return data;
};

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    return handleResponse(res, `GET ${endpoint}`);
  },

  post: async (endpoint, data) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res, `POST ${endpoint}`);
  },

  put: async (endpoint, data) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res, `PUT ${endpoint}`);
  },

  delete: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res, `DELETE ${endpoint}`);
  },
};

export default api;