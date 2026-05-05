import axios from 'axios'

export const getToken = () => {
  return localStorage.getItem('token')
};

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const axiosInstance = axios.create({
  baseURL: apiUrl
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
