/*
import { api } from "../services/api.js";

export const loginService = async (email, password) => {

  const res = await api.post('/auth/login', {user: {email, password}}, {withCredentials: true})

  const { id , role } = res.data.userData

  const user = {id, role}

  return user

}

export const logoutService = () => {
   localStorage.removeItem('token')
}

export const getToken = () => localStorage.getItem('token')
*/
// src/utils/axiosInstance.js
import axios from 'axios';

// 🔐 Función para obtener el token desde localStorage
export const getToken = () => {
  return localStorage.getItem('token'); // o sessionStorage, según tu implementación
};

// 🛠️ Instancia de Axios con configuración base
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Cambia esto por tu URL base
});

// 🧠 Interceptor para agregar el token a cada request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
