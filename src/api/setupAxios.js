// src/api/setupAxios.js
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export const useAxiosSetup = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // ✅ Request interceptor: attach token
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Response interceptor: auto logout on 401
    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout(); // clear context + localStorage
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, [logout]);
};
