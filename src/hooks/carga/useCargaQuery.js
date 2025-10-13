import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../services/api.js";
import axios from "axios";

export function CargaFindAll() { //Obtiene todas las cargas
  return (useQuery({
    queryKey: ['cargaFindAll'],
    queryFn: async () => {
      const res = await api.get('/carga', { withCredentials: true })
      return res.data.items
    }
  }))
}

export function CargaGetOne(){ //Obtiene una carga por ID
  return useMutation({
    mutationKey: ['cargaGetOne'],
    mutationFn: async (cargaId) => {
      console.log(`/carga/${cargaId}`)
      const carga = await api.get(`/carga/${cargaId}`, { withCredentials: true })
      return carga.data.items
    },
  })
}

export function CargaActivos() { //Obtiene todos las cargas activas
  return useQuery({
    queryKey: ['CargaActivos'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/carga')
      return res.data.items.filter(item => item.estado === 'Activo') 
    }
  })
}