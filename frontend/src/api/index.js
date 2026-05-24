// src/api/index.js
import { encrypt, decrypt } from '../utils/crypto';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost/Toriventy/backend/public';

// Helper to attach JWT
const getHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

async function encryptPayload(data) {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    const encryptedArray = [];
    for (const item of data) {
      encryptedArray.push(await encryptPayload(item));
    }
    return encryptedArray;
  }

  const copy = { ...data };
  const keysToEncrypt = ['email', 'password', 'phone'];
  for (const key of keysToEncrypt) {
    if (copy[key] !== undefined && copy[key] !== null && copy[key] !== '') {
      copy[key] = await encrypt(copy[key]);
    }
  }
  return copy;
}

async function decryptPayload(data) {
  if (!data || typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    const decryptedArray = [];
    for (const item of data) {
      decryptedArray.push(await decryptPayload(item));
    }
    return decryptedArray;
  }

  const copy = { ...data };
  const keysToDecrypt = ['email', 'fld_email', 'phone', 'fld_phone'];

  for (const key in copy) {
    if (keysToDecrypt.includes(key) && typeof copy[key] === 'string' && copy[key] !== '') {
      copy[key] = await decrypt(copy[key]);
    } else if (copy[key] && typeof copy[key] === 'object') {
      copy[key] = await decryptPayload(copy[key]);
    }
  }
  return copy;
}

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

  if (data.data) {
    data.data = await decryptPayload(data.data);
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
    const encryptedData = await encryptPayload(data);
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(encryptedData),
    });
    return handleResponse(res, `POST ${endpoint}`);
  },

  put: async (endpoint, data) => {
    const encryptedData = await encryptPayload(data);
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(encryptedData),
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