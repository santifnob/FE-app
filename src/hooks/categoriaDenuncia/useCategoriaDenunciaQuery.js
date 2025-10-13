import { api } from '../../services/api'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'

export function CategoriaDenunciaFindAll() { //Obtiene todas las categorias de denuncias
  return (useQuery({
    queryKey: ['categoriaDenunciaFindAll'],
    queryFn: async () => {
      const res = await api.get('/categoriaDenuncia', { withCredentials: true })
      return res.data.items
    }
  }))
}

export function CategoriaDenunciaGetOne(){ //Obtiene una categoria de denuncia por ID
  return useMutation({
    mutationKey: ['categoriaDenunciaGetOne'],
    mutationFn: async (categoriaDenunciaId) => {
      console.log(`/categoriaDenuncia/${categoriaDenunciaId}`)
      const categoriaDenuncia = await api.get(`/categoriaDenuncia/${categoriaDenunciaId}`, { withCredentials: true })
      return categoriaDenuncia.data.items
    },
  })
}

export function CategoriaDenunciaActivas() { //Obtiene todas las categorias de denuncias activas
  return useQuery({
    queryKey: ['categoriaDenuncias'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/categoriaDenuncia')
      return res.data.items.filter(item => item.estado === 'Activo') 
    }
  })
}