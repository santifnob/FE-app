import { useMutation } from '@tanstack/react-query'
import { api } from '../services/api.js'

export function useRegisterMutation () {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (conductorData) => {
      try{
        await api.post('/conductor', conductorData)
      } catch (error){
        throw new Error(error.response.data.error)
      }
      
    }
  })
}
