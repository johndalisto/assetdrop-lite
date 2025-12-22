// API Configuration
// In production, this will use the Railway backend URL
// In development, it will use localhost or the environment variable

const getApiUrl = (): string => {
  // Check for environment variable first (set in Vercel)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback to localhost for local development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  
  // Production fallback - will be set via Vercel environment variables
  // This should be your Railway backend URL
  return 'https://your-railway-backend.railway.app';
};

export const API_URL = getApiUrl();

export const API_ENDPOINTS = {
  auth: {
    login: `${API_URL}/api/auth/login`,
    register: `${API_URL}/api/auth/register`,
    users: `${API_URL}/api/auth/users`,
  },
  submissions: {
    list: `${API_URL}/api/submissions`,
    create: `${API_URL}/api/submissions`,
    update: (id: string) => `${API_URL}/api/submissions/${id}`,
    export: `${API_URL}/api/submissions/export`,
  },
  files: {
    uploadMultiple: `${API_URL}/api/files/upload-multiple`,
  },
  health: `${API_URL}/api/health`,
};

