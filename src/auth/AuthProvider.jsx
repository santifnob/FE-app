import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'
import { useAuthQuery } from '../hooks/useAuthQuery.js'
import { useLoginMutation } from '../hooks/useLoginMutation.js'
import { useLogoutMutation } from '../hooks/useLogoutMutation.js'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const location = useLocation()

  const { data, isLoading: isAuthLoading, isError: isAuthError } = useAuthQuery(location)

  useEffect(() => {
    if (isAuthError) {
      setUser(null)
    } else if (data) {
      setUser({ id: data.userId, role: data.role })
    }
  }, [data, isAuthError])

  const { mutateAsync: login, isPending: isLoginPending, isError: isLoginError } = useLoginMutation()

  const { mutateAsync: logout, isPending: isLogoutPending, isError: isLogoutError } = useLogoutMutation()

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      isLoginPending,
      isLoginError,
      isLogoutPending,
      isLogoutError,
      isAuthLoading,
      isAuthError
    }}>
      {children}
    </AuthContext.Provider>
  )
}
