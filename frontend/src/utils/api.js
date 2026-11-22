import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

export const recipeService = {
  getAll: (params = {}) => API.get("/recipes", { params }),
  getById: (id) => API.get(`/recipes/${id}`),
  getCategories: () => API.get("/recipes/categories"),
  scale: (id, servings) => API.get(`/recipes/${id}/scale`, { params: { servings } }),
  create: (data) => API.post("/recipes", data),
  update: (id, data) => API.put(`/recipes/${id}`, data),
  delete: (id) => API.delete(`/recipes/${id}`),
};
