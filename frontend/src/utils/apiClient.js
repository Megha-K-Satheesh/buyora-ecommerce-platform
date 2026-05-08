

import axios from "axios";
import { getAuthToken } from "./authToken";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 403 && data?.banned ) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    

    return Promise.reject(error);
  }
);

export default apiClient;
