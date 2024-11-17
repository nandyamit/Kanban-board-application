// client/src/utils/config.ts
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-render-app-url.onrender.com'
  : 'http://localhost:3001';