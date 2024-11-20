const BACKEND_URL = 'https://startupilot.cloud.strixthekiet.me'

export const endpoints = {
  login: `${BACKEND_URL}/api/auth/token/`,
  refresh: `${BACKEND_URL}/api/auth/token/refresh/`,
  startups: `${BACKEND_URL}/api/startups/`,
};
