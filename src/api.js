import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-jisn.onrender.com/api',
});

export const inr = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const num = (n) => Number(n || 0).toLocaleString('en-IN');

export default api;
