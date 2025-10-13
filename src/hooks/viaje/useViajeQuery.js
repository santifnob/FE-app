import { api } from '../../services/api.js'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

export function ViajeFindAll() { //Obtiene todos los viajes
  return (useQuery({
    queryKey: ['viajeFindAll'],
    queryFn: async () => {
      const res = await api.get('/viaje', { withCredentials: true })
      return res.data.items
    }
  })) 
}

export function ViajeGetOne(){ //Obtiene un viaje por ID
  return useMutation({
    mutationKey: ['viajeGetOne'],
    mutationFn: async (viajeId) => {
      console.log(`/viaje/${viajeId}`)
      const viaje = await api.get(`/viaje/${viajeId}`, { withCredentials: true })
      return viaje.data.items
    },
  }) 
}

export function ViajeActivos() { //Obtiene todos los viajes activos
  return useQuery({
    queryKey: ['viajeActivos'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/viaje', { withCredentials: true })
      return res.data.items.filter(item => item.estado === 'Activo') 
    }
  })
}

export function ViajePendientes() { //Obtiene todos los viajes pendientes
  return useQuery({
    queryKey: ['viajePendientes'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/viaje', { withCredentials: true })
      return res.data.items.filter(item => item.estado === 'Pendiente') 
    }
  })
}

export function ViajeInactivos() { //Obtiene todos los viajes inactivos
  return useQuery({
    queryKey: ['viajeInactivos'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/viaje', { withCredentials: true })
      return res.data.items.filter(item => item.estado === 'Inactivo') 
    }
  })
}