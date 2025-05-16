import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, //  the base URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth API calls
export const login = (data) => API.post("/auth/login", data); // Login endpoint
export const register = (data) => API.post("/auth/register", data); // Register endpoint

// Todo API functions
export const getTodos = () => API.get("/todos");
export const addTodo = (todo) => API.post("/todos", todo);
export const updateTodo = (id, todo) => API.put(`/todos/${id}`, todo);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);

export default API;
