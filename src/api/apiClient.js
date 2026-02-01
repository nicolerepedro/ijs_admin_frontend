import axios from "axios";

// ✅ Create a reusable axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // adjust if your backend runs on a different prefix/port
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Optional: attach auth token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
