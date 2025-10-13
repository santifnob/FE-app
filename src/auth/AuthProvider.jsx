import { AuthContext } from '../context/AuthContext.jsx'
import { useState } from 'react'
import { useLoginMutation } from '../hooks/useLoginMutation.js'
import { useLogoutMutation } from '../hooks/useLogoutMutation.js'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const { mutateAsync: login, isPending: isLoginPending, isError: isLoginError } = useLoginMutation()

  const { mutateAsync: logout, isPending: isLogoutPending, isError: isLogoutError } = useLogoutMutation()

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoginPending, isLoginError, isLogoutError, isLogoutPending }}>
      {children}
    </AuthContext.Provider>
  )
}
