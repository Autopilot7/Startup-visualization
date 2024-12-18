const BACKEND_URL = 'https://startupilot.cloud.strixthekiet.me'
export const endpoints = {
  login: `${BACKEND_URL}/api/auth/token/`,
  refresh: `${BACKEND_URL}/api/auth/token/refresh/`,
  startups: `${BACKEND_URL}/api/startups/`,
  categories: `${BACKEND_URL}/api/categories/`,
  members: `${BACKEND_URL}/api/members/`,
  createmembers: `${BACKEND_URL}/api/members/create`,
  uploadavatar: `${BACKEND_URL}/api/file/upload`,
  advisors: `${BACKEND_URL}/api/advisors/`,
  createadvisors: `${BACKEND_URL}/api/advisors/create`,
  createStartup: `${BACKEND_URL}/api/startups/create`,
  createnotes: `${BACKEND_URL}/api/notes/create`,
  phases: `${BACKEND_URL}/api/phases/`,
  statuses: `${BACKEND_URL}/api/statuses/`,
  priorities: `${BACKEND_URL}/api/priorities/`,
  batches: `${BACKEND_URL}/api/batches/`,
};