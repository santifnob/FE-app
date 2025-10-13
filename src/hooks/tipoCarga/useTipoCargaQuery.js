import { api } from '../../services/api'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

export function TipoCargaFindAll() { //Obtiene todos los tipos de cargas
  return (useQuery({
    queryKey: ['tipoCargaFindAll'],
    queryFn: async () => {
      const res = await api.get('/tipoCarga', { withCredentials: true })
      return res.data.items
    }
  }))
}

export function TipoCargaGetOne(){ //Obtiene un tipo de carga por ID
  return useMutation({
    mutationKey: ['tipoCargaGetOne'],
    mutationFn: async (tipoCargaId) => {
      console.log(`/tipoCarga/${tipoCargaId}`)
      const tipoCarga = await api.get(`/tipoCarga/${tipoCargaId}`, { withCredentials: true })
      return tipoCarga.data.items
    },
  })
}

export function TipoCargaActivos() { //Obtiene todos los tipos de cargas activos
  return useQuery({
    queryKey: ['tipoCargas'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/tipoCarga')
      return res.data.items.filter(item => item.estado === 'Activo') 
    }
  })
}

