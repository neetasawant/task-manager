// utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://task-manager-vdtv.onrender.com/api", // or your deployed backend
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // Not "token"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
