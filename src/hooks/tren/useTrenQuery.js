import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../../services/api.js";

export function TrenFindAll() { //Obtiene todos los trenes
  return (useQuery({
    queryKey: ['trenFindAll'],
    queryFn: async () => {
      const res = await api.get('/tren', { withCredentials: true })
      return res.data.items
    }
  }))
}

export function TrenGetOne(){ //Obtiene un tren por ID
return useMutation({
    mutationKey: ['trenGetOne'],
    mutationFn: async (trenId) => {
    console.log(`/tren/${trenId}`)
    const tren = await api.get(`/tren/${trenId}`, { withCredentials: true })
    return tren.data.items
    },
})
}

export function TrenActivos() { //Obtiene todos los trenes activos (falta validar que funciona)
  return (useQuery({
    queryKey: ['trenActivos'],
    queryFn: async () => {
      const res = await api.get('/tren', { withCredentials: true })
      return res.data.items.filter(item => item.estadoActual?.nombre === 'Disponible');
    }
  }))
}