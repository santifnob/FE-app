import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../services/api.js";
import axios from "axios";

export function EstadoTrenFindAll() { //Obtiene todos los estados de trenes
  return (useQuery({
    queryKey: ['estadoTrenFindAll'],
    queryFn: async () => {
      const res = await api.get('/estadoTren', { withCredentials: true })
      return res.data.items 
    }
  }))
}

export function EstadoTrenGetOne(){ //Obtiene un estado de tren por ID
  return useMutation({
    mutationKey: ['estadoTrenGetOne'],
    mutationFn: async (estadoTrenId) => {
      console.log(`/estadoTren/${estadoTrenId}`)
      const estadoTren = await api.get(`/estadoTren/${estadoTrenId}`, { withCredentials: true })
      return estadoTren.data.items
    },
  })
}

export function EstadoTrenActivos() { //Obtiene todos los estados de trenes activos
  return useQuery({
    queryKey: ['estadoTrenActivos'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/estadoTren')
      return res.data.items.filter(item => item.estado === 'Activo') 
    }
  })
}