import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { api } from '../../services/api'

export function useViajePost () {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['viajePost'],
    mutationFn: async (viaje) => {
      await api.post('/viaje', viaje, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['viajesQuery'])
    }
  })
}


export function useValidationCheck(watchIdTren, watchIdConductor, watchFechaFin, watchFechaIni, idViajeToEdit){
  return useQuery({
  queryKey: ['validarViaje', watchIdTren, watchIdConductor, watchFechaIni, watchFechaFin, idViajeToEdit],
  queryFn: () => api.get('/viaje/validation', { 
    params: { 
      trenId: watchIdTren, 
      conductorId: watchIdConductor, 
      inicio: watchFechaIni, 
      fin: watchFechaFin,
      idViajeToEdit: idViajeToEdit
    },
    withCredentials: true
  }),
  enabled: !!watchFechaIni && !!watchFechaFin && (!!watchIdTren || !!watchIdConductor),
  retry: false,
  staleTime: 5000 // Para no saturar el server si el usuario cambia rápido,
  
});
}
