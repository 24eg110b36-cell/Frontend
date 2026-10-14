import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  // If running in production / on Vercel, guarantee it never falls back to localhost
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    if (!envUrl || envUrl.includes('localhost')) {
      return 'https://backend-jisn.onrender.com/api';
    }
  }
  return envUrl || 'https://backend-jisn.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

export const inr = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const num = (n) => Number(n || 0).toLocaleString('en-IN');

export default api;
