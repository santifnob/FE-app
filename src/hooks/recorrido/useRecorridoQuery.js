import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../services/api.js";

export function RecorridoFindAll () { //Obtiene todos los recorridos
  return (useQuery({
    queryKey: ['recorridoFindAll'],
    queryFn: async () => {
      const res = await api.get('/recorrido', { withCredentials: true })
      return res.data.items
    }
  }))
}

export function RecorridoGetOne(){ //Obtiene un recorrido por ID
  return useMutation({
    mutationKey: ['recorridoGetOne'],
    mutationFn: async (recorridoId) => {
      console.log(`/recorrido/${recorridoId}`)
      const recorrido = await api.get(`/recorrido/${recorridoId}`, { withCredentials: true })
      return recorrido.data.items
    },
  })
}

export function RecorridoActivos () { //Obtiene todos los recorridos activos
  return (useQuery({
    queryKey: ['recorridoActivos'],
    queryFn: async () => {
      const res = await api.get('/recorrido', { withCredentials: true })
      return res.data.items.filter(item => item.estado === 'Activo')
    }
  }))
}