import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

// Hook personalizado para obtener el usuario del contexto
export const useCurrentUser = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useCurrentUser debe usarse dentro de AuthProvider')
  }

  return {
    user: context.user, // Datos del usuario logueado
    setUser: context.setUser, // Función para actualizar usuario
    isLoading: context.isAuthLoading, // Estado de carga de comprobación de sesión
    isError: context.isAuthError // Estado de error de comprobación de sesión
  }
}
