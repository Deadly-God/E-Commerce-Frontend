import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
};

// Items API
export const itemsAPI = {
  getAll: (params = {}) => api.get("/items", { params }),
  getById: (id) => api.get(`/items/${id}`),
  getCategories: () => api.get("/items/categories"),
};

// Cart API
export const cartAPI = {
  get: () => api.get("/cart"),
  add: (itemData) => api.post("/cart", itemData),
  update: (cartId, data) => api.put(`/cart/${cartId}`, data),
  remove: (cartId) => api.delete(`/cart/${cartId}`),
  clear: () => api.delete("/cart"),
};

export default api;
