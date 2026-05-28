import { createContext, useCallback, useMemo, useState } from 'react'
import * as authApi from '../api/auth.api'
import {
  clearAuth,
  getStoredToken,
  getStoredUser,
  saveAuth,
} from '../utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [token, setToken] = useState(() => getStoredToken())
  const [loading, setLoading] = useState(false)

  const isAuthenticated = Boolean(token && user)

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const response = await authApi.login(credentials)
      if (!response.success) {
        throw new Error(response.message || 'Đăng nhập thất bại')
      }
      const { user: userData, token: accessToken } = response.data
      saveAuth({ user: userData, token: accessToken })
      setUser(userData)
      setToken(accessToken)
      return userData
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const response = await authApi.register(payload)
      if (!response.success) {
        throw new Error(response.message || 'Đăng ký thất bại')
      }
      const { user: userData, token: accessToken } = response.data
      saveAuth({ user: userData, token: accessToken })
      setUser(userData)
      setToken(accessToken)
      return userData
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
    setToken(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [user, token, loading, isAuthenticated, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
