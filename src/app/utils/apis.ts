const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const endpoints = {
  login: `${API_BASE_URL}/api/auth/token/`,
  refresh: `${API_BASE_URL}/api/auth/token/refresh/`,
  startups: `${API_BASE_URL}/api/startups/`,
};
